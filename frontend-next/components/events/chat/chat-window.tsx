import { Timestamp } from "@firebase/firestore";
import { Image } from "@nextui-org/react";

import { IMessage } from "@/components/events/chat/messages";
import { getHowLongAgo } from "@/utils/date-time";

export interface IChat {
  id?: string;
  eventId?: string;
  lastMessage?: IMessage;
  lastUpdatedAt?: Timestamp;
  createdAt?: Timestamp;
  chatImage?: string;
  users?: string[];
}

const ChatWindow = ({ chat }: { chat: IChat }) => {
  return (
    <a
      className="dark:hover:bg-stone-900 hover:bg-stone-300 hover:opacity-80 cursor-pointer"
      href={`/admin/events/${chat.eventId}/active/chats/${chat.id}`}
    >
      <div className="w-full flex flex-row justify-start border-1 space-x-10">
        <div className="flex flex-row space-x-3 p-1 items-center">
          <div className="min-w-fit">
            <Image
              className="rounded-full border-2"
              fallbackSrc={"/images/user-fallback.png"}
              height="40"
              src={chat.chatImage || "/images/user-fallback.png"}
              width="40"
            />
          </div>
          <div>
            <p className="text-lg font-bold">{chat.lastMessage?.userName}: </p>
            <p className="text-xs">
              {chat.lastUpdatedAt && getHowLongAgo(chat.lastUpdatedAt.toDate())}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {chat.lastMessage?.text}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ChatWindow;
