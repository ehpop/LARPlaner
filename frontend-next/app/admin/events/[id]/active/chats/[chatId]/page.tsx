"use client";

import React from "react";

import Chat from "@/components/events/chat/chat";

const ActiveEventAdminChatPage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string; chatId: string };
  const eventId = resolvedParams.id;
  const chatId = resolvedParams.chatId;

  return <Chat chatId={chatId} eventId={eventId} />;
};

export default ActiveEventAdminChatPage;
