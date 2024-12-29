import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import { Timestamp } from "@firebase/firestore";

import { useAuth } from "@/providers/firebase-provider";
import { getTimeOrDate } from "@/utils/date-time";

export interface IMessage {
  id?: string;
  text?: string;
  createdAt?: Timestamp;
  eventId?: string;
  chatId?: string;
  userName?: string;
  userPhoto?: string;
  userEmail?: string;
}

const Message = ({ message }: { message: IMessage }) => {
  const auth = useAuth();
  const isMessageFromCurrentUser = (message: IMessage) =>
    message.userEmail === auth.user?.email;

  return (
    <MessageContent
      isFromCurrentUser={isMessageFromCurrentUser(message)}
      message={message}
    />
  );
};

const MessageContent = ({
  message,
  isFromCurrentUser,
}: {
  message: IMessage;
  isFromCurrentUser: boolean;
}) => {
  const messageWrapperClass = isFromCurrentUser
    ? "sm:w-1/2 w-4/5 flex-row-reverse justify-self-end pr-3"
    : "sm:w-1/2 w-4/5 flex pl-3";

  const bubbleClass = isFromCurrentUser
    ? "p-3 rounded-3xl bg-primary-500"
    : "p-3 rounded-3xl bg-foreground-300";

  return (
    <div className="w-full">
      <div className={`${messageWrapperClass} space-x-3`}>
        <div className="flex-col space-y-1">
          <div
            className={`flex items-end space-x-1 ${isFromCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div className="flex min-w-fit">
              <Image
                alt={"user photo"}
                as={NextImage}
                className="border-2"
                fallbackSrc={"/images/user-fallback.png"}
                height="40"
                radius="full"
                src={message.userPhoto || "/images/user-fallback.png"}
                width="40"
              />
            </div>
            <div className={bubbleClass}>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <p className="text-xs">
              {message.createdAt &&
                getTimeOrDate(new Date(message.createdAt.seconds * 1000))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
