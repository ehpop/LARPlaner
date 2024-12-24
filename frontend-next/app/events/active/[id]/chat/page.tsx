"use client";

interface ActiveEventChatPageProps {
  params: {
    id: string;
  };
}

const ActiveEventChatPage = ({ params }: ActiveEventChatPageProps) => {
  return <div>Chat page for event {params.id}</div>;
};

export default ActiveEventChatPage;
