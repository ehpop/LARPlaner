"use client";

import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";

import { useAuth } from "@/providers/firebase-provider";
import { db } from "@/config/firebase";
import LoadingOverlay from "@/components/general/loading-overlay";
import ChatWindow, { IChat } from "@/components/events/chat/chat-window";

const ActiveEventAdminChatsPage = ({ params }: any) => {
  const eventId = params.id;
  const auth = useAuth();
  const intl = useIntl();

  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<IChat[]>([]);

  const chatsRef = collection(db, "chats");

  useEffect(() => {
    if (auth.loading) return;

    const unsubscribe = onSnapshot(
      query(
        chatsRef,
        where("eventId", "==", eventId),
        orderBy("lastUpdatedAt", "desc"),
        limit(100),
      ),
      (snapshot) => {
        const newChats = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setChats(newChats);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [auth.loading, eventId]);

  return (
    <LoadingOverlay
      isLoading={loading}
      label={intl.formatMessage({
        defaultMessage: "Loading chats...",
        id: "admin.events.id.active.chats.loading",
      })}
    >
      <div className="w-full flex flex-col justify-center border-1 p-3">
        <div className="w-full flex justify-center mb-5">
          <p className="text-xl">
            <FormattedMessage
              defaultMessage="Chats for event {eventId}"
              id="admin.events.id.active.chats.title"
              values={{ eventId }}
            />
          </p>
        </div>
        {chats.length > 0 ? (
          <div className="w-full flex flex-col space-y-5">
            {chats.map((chat) => (
              <ChatWindow key={chat.id} chat={chat} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center p-3">
            {intl.formatMessage({
              defaultMessage: "No chats found.",
              id: "admin.events.id.active.chats.noChats",
            })}
          </div>
        )}
      </div>
    </LoadingOverlay>
  );
};

export default ActiveEventAdminChatsPage;
