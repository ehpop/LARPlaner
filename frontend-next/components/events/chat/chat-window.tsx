import { Timestamp } from "@firebase/firestore";
import { Image } from "@heroui/react";
import { useIntl } from "react-intl";
import { User } from "@firebase/auth";
import Link from "next/link";

import { IMessage } from "@/components/events/chat/messages";
import { getTimeOrDate } from "@/utils/date-time";

export interface IUserData {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

export interface IChat {
  id?: string;
  eventId?: string;
  lastMessage?: IMessage;
  lastUpdatedAt?: Timestamp;
  createdAt?: Timestamp;
  chatImage?: string;
  userData?: IUserData;
}

const ChatWindow = ({
  chat,
  currentUser,
}: {
  chat: IChat;
  currentUser: User;
}) => {
  const intl = useIntl();

  return (
    <Link
      aria-label={`Chat with ${chat.userData?.displayName}`}
      className="block dark:hover:bg-stone-900 hover:bg-stone-300 hover:opacity-80 cursor-pointer"
      href={`/admin/events/${chat.eventId}/active/chats/${chat.id}`}
    >
      <div className="w-full max-w-full flex flex-row justify-start items-start border space-x-3 p-3">
        <div className="min-w-fit self-center">
          <Image
            alt={chat.userData?.displayName || "User"}
            className="rounded-full border"
            height={40}
            src={chat.chatImage || "/images/user-fallback.png"}
            width={40}
          />
        </div>

        <div className="sm:w-[90%] w-[70%] flex-1 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold truncate">
              {chat.userData?.displayName}
            </h2>
            <span className="text-xs text-gray-500">
              {chat.lastUpdatedAt && getTimeOrDate(chat.lastUpdatedAt.toDate())}
            </span>
          </div>

          <div className="w-full flex items-center space-x-1">
            {currentUser.email === chat.lastMessage?.userEmail && (
              <span className="text-gray-600">
                {intl.formatMessage({
                  defaultMessage: "You: ",
                  id: "admin.events.id.active.chats.you",
                })}
              </span>
            )}
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="truncate">{chat.lastMessage?.text}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChatWindow;
