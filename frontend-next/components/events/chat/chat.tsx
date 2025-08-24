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
import { Spinner } from "@heroui/react";
import { Button } from "@heroui/button";

import { db } from "@/config/firebase";
import Message, { IMessage } from "@/components/events/chat/messages";
import { useAuth } from "@/providers/firebase-provider";
import LoadingOverlay from "@/components/common/loading-overlay";
import { IChat } from "@/components/events/chat/chat-window";
import FormTextarea from "@/components/forms/form-textarea";
import { IEventPersisted } from "@/types/event.types";
import { IGameRoleStateSummary } from "@/types/game.types";
import { IRolePersisted } from "@/types/roles.types";
import { useUserInfo } from "@/services/admin/useUsers";

const Chat = ({
  userRole,
  userGameRoleState,
  event,
  chatId,
}: {
  userRole?: IRolePersisted;
  userGameRoleState?: IGameRoleStateSummary;
  event: IEventPersisted;
  chatId: string;
}) => {
  const auth = useAuth();
  const intl = useIntl();

  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null,
  );

  const {
    data: fetchedUserInfo,
    error,
    isError,
    isLoading: isUserLoading,
  } = useUserInfo(userGameRoleState?.assignedUserID);

  const isLoading = isUserLoading || auth.loading;

  const messagesRef = collection(db, "messages");

  const messagesEndRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const getCountMessages = async () => {
    const countQuery = query(
      collection(db, "messages"),
      where("eventId", "==", event.id),
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
      where("eventId", "==", event.id),
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
    if (isLoading) return;

    const fetchTotalMessageCount = async () => {
      const count = await getCountMessages();

      setTotalMessages(count);
    };

    fetchTotalMessageCount().then(() => {});

    const unsubscribe = onSnapshot(
      query(
        messagesRef,
        where("eventId", "==", event.id),
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
  }, [isLoading, event]);

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
      eventId: event.id,
      userName: auth.user?.displayName,
      userPhoto: auth.user?.photoURL || "",
      userEmail: auth.user?.email,
      userUid: auth.user?.uid,
      chatId: chatId,
    };

    await addDoc(messagesRef, newMessageDoc);

    const userForThisChat = userGameRoleState ? fetchedUserInfo : auth.user;

    const newChatDoc: IChat =
      totalMessages === 0
        ? {
            eventId: event.id,
            lastMessage: newMessageDoc,
            lastUpdatedAt: serverTimestamp() as Timestamp,
            createdAt: serverTimestamp() as Timestamp,
            chatImage: userForThisChat?.photoURL || "",
            userData: {
              displayName: userForThisChat?.displayName || "",
              email: userForThisChat?.email || "",
              photoURL: userForThisChat?.photoURL || "",
              uid: userForThisChat?.uid || "",
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
      <div className="w-full flex justify-between space-x-3 border rounded-small p-3">
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

  if (isError || (userGameRoleState && !fetchedUserInfo))
    return (
      <div className="w-full flex justify-center p-6 text-center">
        <p className="text-lg text-danger-600">
          <FormattedMessage
            defaultMessage="Cannot load user data. User you started chat with may not exist or his account was deleted. Error: {error}"
            id="events.chat.page.cannotLoad"
            values={{ error: error?.message }}
          />
        </p>
      </div>
    );

  return (
    <LoadingOverlay
      isLoading={loading}
      label={intl.formatMessage({
        id: "events.active.id.chat.loading",
        defaultMessage: "Loading chat...",
      })}
    >
      <div className="w-full h-[75vh] flex flex-col justify-start space-y-5">
        {userGameRoleState && (
          <FormattedMessage
            defaultMessage="Chat for event {eventName} with user {userEmail} that has assigned role: {userRoleName}"
            id="events.active.id.chat.admin.title"
            tagName="h1"
            values={{
              eventName: event.name,
              userEmail: userGameRoleState.assignedEmail,
              userRoleName: userGameRoleState.scenarioRole.role.name,
            }}
          />
        )}
        {userRole && (
          <FormattedMessage
            defaultMessage="Chat for event {eventName}, your assigned role: {userRoleName}"
            id="events.active.id.chat.user.title"
            tagName="h1"
            values={{ eventName: event.name, userRoleName: userRole.name }}
          />
        )}
        <div className="h-full flex flex-col-reverse border p-3 space-y-3 space-y-reverse overflow-y-auto rounded-small">
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
