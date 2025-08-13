"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuth } from "@/providers/firebase-provider";

const wsBaseUrl =
  process.env.NEXT_PUBLIC_WS_BASE_URL || "https://localhost:8443/ws";

interface StompContextType {
  client: Client | null;
  isConnected: boolean;
}

const StompClientContext = createContext<StompContextType>({
  client: null,
  isConnected: false,
});

export const useStomp = (): StompContextType => {
  return useContext(StompClientContext);
};

export const StompClientProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  const clientRef = useRef<Client | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!auth.user) {
      if (clientRef.current?.active) {
        console.log("STOMP: User logged out, deactivating client.");
        clientRef.current.deactivate();
      }

      return;
    }

    const setupAndConnect = async () => {
      try {
        const token = await auth.user?.getIdToken();

        if (!clientRef.current) {
          const newClient = new Client({
            webSocketFactory: () => {
              return new SockJS(wsBaseUrl);
            },
            connectHeaders: {
              Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            debug: (str: any) => {
              console.log("STOMP DEBUG:", str);
            },
            onConnect: (frame) => {
              console.log("STOMP: Connected to server.", frame);
              setIsConnected(true);
            },
            onStompError: (frame) => {
              console.error(
                "STOMP: Broker reported error: " + frame.headers["message"],
              );
              console.error("STOMP: Additional details: " + frame.body);
              setIsConnected(false);
            },
            onDisconnect: () => {
              console.log("STOMP: Client disconnected.");
              setIsConnected(false);
              clientRef.current = null;
            },
          });

          clientRef.current = newClient;
        }

        if (!clientRef.current.active) {
          clientRef.current.activate();
        }
      } catch (error) {
        console.error("STOMP: Failed to get auth token for connection.", error);
      }
    };

    setupAndConnect();

    return () => {
      if (clientRef.current?.active) {
        console.log("STOMP: Cleaning up client on effect change or unmount.");
        clientRef.current.deactivate();
      }
    };
  }, [auth.user]);

  const value = useMemo(
    () => ({
      client: clientRef.current,
      isConnected,
    }),
    [isConnected],
  );

  return (
    <StompClientContext.Provider value={value}>
      {children}
    </StompClientContext.Provider>
  );
};
