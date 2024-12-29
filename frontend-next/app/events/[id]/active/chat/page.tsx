"use client";

import { useAuth } from "@/providers/firebase-provider";
import Chat from "@/components/events/chat/chat";

const ActiveEventChatPage = ({ params }: any) => {
  const auth = useAuth();
  const eventId = params.id;
  const chatId = `${eventId}-${auth.user?.uid}`;

  if (auth.loading) {
    return null;
  }

  return <Chat chatId={chatId} eventId={eventId} />;
};

export default ActiveEventChatPage;
