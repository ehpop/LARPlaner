import { FormattedMessage, useIntl } from "react-intl";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from "@firebase/firestore";
import { Spinner } from "@nextui-org/react";
import { Button } from "@nextui-org/button";

import { db } from "@/config/firebase";
import Message, { IMessage } from "@/components/events/chat/messages";
import { useAuth } from "@/providers/firebase-provider";
import LoadingOverlay from "@/components/general/loading-overlay";
import { IChat } from "@/components/events/chat/chat-window";
import FormTextarea from "@/components/forms/form-textarea";

const Chat = ({ eventId, chatId }: { eventId: string; chatId: string }) => {
  const auth = useAuth();
  const intl = useIntl();

  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null,
  );

  const messagesRef = collection(db, "messages");

  const messagesEndRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const getCountMessages = async () => {
    const countQuery = query(
      collection(db, "messages"),
      where("eventId", "==", eventId),
      where("chatId", "==", chatId),
    );

    const snapshot = await getCountFromServer(countQuery);

    return snapshot.data().count;
  };

  const fetchPaginatedMessages = async (
    lastDoc: QueryDocumentSnapshot | null = null,
  ) => {
    if (totalMessages !== null && messages.length >= totalMessages) return; // Stop if all messages are loaded

    const baseQuery = query(
      messagesRef,
      where("eventId", "==", eventId),
      where("chatId", "==", chatId),
      orderBy("createdAt", "desc"),
      limit(100),
    );

    const paginatedQuery = lastDoc
      ? query(baseQuery, startAfter(lastDoc))
      : baseQuery;

    if (lastDoc) {
      setIsFetchingMore(true);
    }

    try {
      const snapshot = await getDocs(paginatedQuery);
      const newMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setMessages((prevMessages) => {
        return [...prevMessages, ...newMessages].reduce((acc, message) => {
          if (!acc.find((m: IMessage) => m.id === message.id)) {
            acc.push(message);
          }

          return acc;
        }, [] as IMessage[]);
      });
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (auth.loading) return;

    const fetchTotalMessageCount = async () => {
      const count = await getCountMessages();

      setTotalMessages(count);
    };

    fetchTotalMessageCount().then(() => {});

    const unsubscribe = onSnapshot(
      query(
        messagesRef,
        where("eventId", "==", eventId),
        where("chatId", "==", chatId),
        orderBy("createdAt", "desc"),
        limit(100),
      ),
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMessages(newMessages);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [auth.loading, eventId]);

  useEffect(() => {
    const handleScroll = () => {
      const containerParent = messagesEndRef.current?.parentElement;

      if (!containerParent || !lastVisible) return;

      if (
        containerParent.scrollTop ===
          -(containerParent.scrollHeight - containerParent.clientHeight) &&
        messages.length < (totalMessages || Infinity)
      ) {
        fetchPaginatedMessages(lastVisible).then(() => {});
      }
    };

    const container = messagesEndRef.current?.parentNode;

    container?.addEventListener("scroll", handleScroll);

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [lastVisible, messages, totalMessages]);

  const handleMessageSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !auth.user ||
      !auth.user.displayName ||
      !auth.user.email ||
      loading ||
      newMessage === ""
    )
      return;

    const newMessageDoc: IMessage = {
      text: newMessage,
      createdAt: serverTimestamp() as Timestamp,
      eventId,
      userName: auth.user?.displayName,
      userPhoto: auth.user?.photoURL || "",
      userEmail: auth.user?.email,
      userUid: auth.user?.uid,
      chatId: chatId,
    };

    await addDoc(messagesRef, newMessageDoc);
    const newChatDoc: IChat =
      totalMessages === 0
        ? {
            eventId,
            lastMessage: newMessageDoc,
            lastUpdatedAt: serverTimestamp() as Timestamp,
            createdAt: serverTimestamp() as Timestamp,
            chatImage: auth.user?.photoURL || "",
            userData: {
              displayName: auth.user?.displayName || "",
              email: auth.user?.email || "",
              photoURL: auth.user?.photoURL || "",
              uid: auth.user?.uid || "",
            },
          }
        : {
            lastMessage: newMessageDoc,
            lastUpdatedAt: serverTimestamp() as Timestamp,
          };

    await setDoc(doc(db, "chats", chatId), newChatDoc, {
      merge: true,
    });

    setNewMessage("");
    setTotalMessages((prev) => (prev !== null ? prev + 1 : null));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const newMessageElement = (
    <form ref={formRef} onSubmit={(e) => handleMessageSend(e)}>
      <div className="w-full flex justify-between space-x-3 border-1 rounded-small p-3">
        <FormTextarea
          formRef={formRef}
          maxRows={10}
          minRows={1}
          placeholder={intl.formatMessage({
            defaultMessage: "Type your message here...",
            id: "events.active.id.chat.typeMessage",
          })}
          value={newMessage}
          variant="bordered"
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
        />
        <Button
          color="primary"
          isDisabled={loading || newMessage === ""}
          type="submit"
        >
          <FormattedMessage
            defaultMessage="Send"
            id="events.active.id.chat.send"
          />
        </Button>
      </div>
    </form>
  );

  return (
    <LoadingOverlay
      isLoading={loading}
      label={intl.formatMessage({
        id: "events.active.id.chat.loading",
        defaultMessage: "Loading chat",
      })}
    >
      <div className="w-full h-[75vh] flex flex-col justify-start space-y-5">
        <FormattedMessage
          defaultMessage="Chat for event {eventId}, chatId {chatId}"
          id="events.active.id.chat.title"
          tagName="h1"
          values={{ eventId, chatId }}
        />
        <div className="h-full flex flex-col-reverse border-1 p-3 space-y-3 overflow-y-auto rounded-small">
          <div ref={messagesEndRef} />
          {messages.map((message: any, index) => (
            <Message key={index} message={message} />
          ))}
          {isFetchingMore && (
            <Spinner
              label={intl.formatMessage({
                id: "events.active.id.chat.loadingMore",
                defaultMessage: "Loading more messages",
              })}
            />
          )}
        </div>
        {newMessageElement}
      </div>
    </LoadingOverlay>
  );
};

export default Chat;
