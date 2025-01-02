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
  userUid?: string;
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
  const messageWrapperClassBase = "md:w-3/5 w-4/5 max-w-full";
  const messageWrapperClass = isFromCurrentUser
    ? `${messageWrapperClassBase} flex-row-reverse justify-self-end sm:pr-3 pr-1`
    : `${messageWrapperClassBase} flex-row sm:pl-3 pl-1`;

  const bubbleClassBase =
    "max-w-full p-3 break-words whitespace-pre-wrap overflow-hidden rounded-3xl";
  const bubbleClass = isFromCurrentUser
    ? `${bubbleClassBase} bg-primary-500`
    : `${bubbleClassBase} bg-foreground-300`;

  return (
    <div className="w-full">
      <div className={`${messageWrapperClass} space-x-3`}>
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
          <div className="flex justify-end min-w-fit">
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
