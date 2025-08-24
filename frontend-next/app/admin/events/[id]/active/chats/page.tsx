"use client";

import { FormattedMessage, useIntl } from "react-intl";
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { User } from "@firebase/auth";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/providers/firebase-provider";
import { db } from "@/config/firebase";
import ChatWindow, { IChat } from "@/components/events/chat/chat-window";
import { IEventPersisted } from "@/types/event.types";
import { useEvent } from "@/services/events/useEvents";

// Custom hook to encapsulate Firestore chat subscription
const useEventChats = (eventId?: string) => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);

      return;
    }

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("eventId", "==", eventId),
      orderBy("lastUpdatedAt", "desc"),
      limit(100),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newChats = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as IChat[];

        setChats(newChats);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching chats:", err);
        setError(err);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [eventId]);

  return { chats, isLoading, error };
};

const ActiveEventAdminChatsPage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;
  const { user, loading: isAuthLoading } = useAuth();

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
    error: eventError,
  } = useEvent(eventId);

  const {
    chats,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useEventChats(event?.id);

  const isLoading = isAuthLoading || isEventLoading || isChatsLoading;
  const isError = isEventError || chatsError;
  const errorMessage = eventError?.message || chatsError?.message;

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading chats..." />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      ) : event && user ? (
        <ChatDisplay chats={chats} currentUser={user} event={event} />
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-zinc-500 dark:text-zinc-400">
            <FormattedMessage
              defaultMessage="Could not load event data."
              id="admin.events.id.active.chats.loadError"
            />
          </p>
        </div>
      )}
    </div>
  );
};

const ChatDisplay = ({
  chats,
  currentUser,
  event,
}: {
  chats: IChat[];
  currentUser: User;
  event: IEventPersisted;
}) => {
  const intl = useIntl();
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const displayedChats = useMemo(() => {
    let filtered = filterText
      ? chats.filter((chat) =>
          chat.userData?.displayName
            ?.toLowerCase()
            .includes(filterText.toLowerCase()),
        )
      : chats;

    const getTime = (chat: IChat) => chat.lastUpdatedAt?.toMillis() ?? 0;

    return [...filtered].sort((a, b) =>
      sortBy === "newest" ? getTime(b) - getTime(a) : getTime(a) - getTime(b),
    );
  }, [chats, filterText, sortBy]);

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            <FormattedMessage
              defaultMessage="Event Chats: {eventName}"
              id="admin.events.id.active.chats.title"
              values={{ eventName: event.name }}
            />
          </h1>
          {chats.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Input
                placeholder={intl.formatMessage({
                  defaultMessage: "Filter by user...",
                  id: "admin.events.id.active.chats.filterPlaceholder",
                })}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <Select
                aria-label={intl.formatMessage({
                  defaultMessage: "Sort chats",
                  id: "admin.events.id.active.chats.sortLabel",
                })}
                className="w-full sm:w-full"
                selectedKeys={new Set([sortBy])}
                onSelectionChange={(keys) =>
                  setSortBy(Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="newest">
                  {intl.formatMessage({
                    defaultMessage: "Newest First",
                    id: "admin.events.id.active.chats.sortNewest",
                  })}
                </SelectItem>
                <SelectItem key="oldest">
                  {intl.formatMessage({
                    defaultMessage: "Oldest First",
                    id: "admin.events.id.active.chats.sortOldest",
                  })}
                </SelectItem>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        {displayedChats.length > 0 ? (
          <div className="w-full space-y-4">
            {displayedChats.map((chat) => (
              <ChatWindow key={chat.id} chat={chat} currentUser={currentUser} />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center text-center p-10 space-y-3">
            <ChatBubbleOvalLeftEllipsisIcon className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
            <p className="font-medium text-zinc-600 dark:text-zinc-400">
              {filterText ? (
                <FormattedMessage
                  defaultMessage="No chats match your filter."
                  id="admin.events.id.active.chats.noFilterMatch"
                />
              ) : (
                <FormattedMessage
                  defaultMessage="No chats found for this event yet."
                  id="admin.events.id.active.chats.noChats"
                />
              )}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ActiveEventAdminChatsPage;
