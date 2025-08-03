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
import { Input, Select, SelectItem } from "@heroui/react";

import { useAuth } from "@/providers/firebase-provider";
import { db } from "@/config/firebase";
import LoadingOverlay from "@/components/common/loading-overlay";
import ChatWindow, { IChat } from "@/components/events/chat/chat-window";

const ActiveEventAdminChatsPage = ({ params }: any) => {
  const resolvedParams = React.use(params) as { id: string };
  const eventId = resolvedParams.id;
  const auth = useAuth();
  const intl = useIntl();

  const [loading, setLoading] = useState(true);
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
      {chats && auth.user && (
        <ChatDisplay chats={chats} currentUser={auth.user} eventId={eventId} />
      )}
    </LoadingOverlay>
  );
};

const ChatDisplay = ({
  chats,
  currentUser,
  eventId,
}: {
  chats: IChat[];
  currentUser: User;
  eventId: string;
}) => {
  const intl = useIntl();
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const displayedChats = useMemo(() => {
    let filtered = chats;

    if (filterText) {
      const lowerCaseFilter = filterText.toLowerCase();

      filtered = chats.filter((chat) => {
        const partsOfUsername = chat.userData?.displayName
          ?.toLowerCase()
          .split(" ");

        if (!partsOfUsername) return false;

        return partsOfUsername.some((part) => part.startsWith(lowerCaseFilter));
      });
    }

    let sorted = [...filtered];
    const getTime = (chat: IChat) => chat.lastUpdatedAt?.toMillis() ?? 0;

    if (sortBy === "newest") {
      sorted.sort((a, b) => getTime(b) - getTime(a));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => getTime(a) - getTime(b));
    }

    return sorted;
  }, [chats, filterText, sortBy]);

  return (
    <div className="w-full flex flex-col border rounded-lg shadow-sm p-4 md:p-6 bg-white dark:bg-stone-900">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-0">
          <FormattedMessage
            defaultMessage="Chats for Event {eventId}"
            id="admin.events.id.active.chats.title"
            values={{ eventId }}
          />
        </h2>
        {chats.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              className="max-w-xs"
              placeholder={intl.formatMessage({
                defaultMessage: "Filter chats...",
                id: "admin.events.id.active.chats.filterPlaceholder",
              })}
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <Select
              aria-label={intl.formatMessage({
                defaultMessage: "Sort chats",
                id: "admin.events.id.active.chats.sortLabel",
              })}
              className="w-full sm:w-[180px]"
              placeholder={intl.formatMessage({
                defaultMessage: "Sort by",
                id: "admin.events.id.active.chats.sortByPlaceholder",
              })}
              selectedKeys={new Set([sortBy])}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];

                if (selectedKey !== undefined) {
                  setSortBy(String(selectedKey));
                }
              }}
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

      {displayedChats.length > 0 ? (
        <div className="w-full space-y-4">
          {displayedChats.map((chat) => (
            <ChatWindow key={chat.id} chat={chat} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center p-6 text-gray-500 dark:text-gray-400">
          {filterText ? (
            <p>
              <FormattedMessage
                defaultMessage="No chats match your filter."
                id="admin.events.id.active.chats.noFilterMatch"
              />
            </p>
          ) : (
            <p>
              <FormattedMessage
                defaultMessage="No chats found for this event."
                id="admin.events.id.active.chats.noChats"
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveEventAdminChatsPage;
