"use client";

import Chat from "@/components/events/chat/chat";

const ActiveEventAdminChatPage = ({ params }: any) => {
  const eventId = params.id;
  const chatId = params.chatId;

  return <Chat chatId={chatId} eventId={eventId} />;
};

export default ActiveEventAdminChatPage;
