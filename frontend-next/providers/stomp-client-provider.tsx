import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuth } from "@/providers/firebase-provider";

const wsBaseUrl = "https://localhost:8443/ws";

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
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      if (!auth.user) {
        if (stompClient) {
          stompClient.deactivate();
        }

        return;
      }

      try {
        const token = await auth.user.getIdToken();
        const client = new Client({
          webSocketFactory: () => {
            const url = process.env.NEXT_PUBLIC_WS_BASE_URL || wsBaseUrl;

            return new SockJS(url);
          },
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          reconnectDelay: 5000,
          debug: (str: any) => {
            console.log("STOMP DEBUG:", str);
          },
          onConnect: (frame) => {
            console.log("Connected to STOMP server:", frame);
            setIsConnected(true);
          },
          onStompError: (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
            setIsConnected(false);
          },
          onDisconnect: () => {
            console.log("STOMP client disconnected");
            setIsConnected(false);
          },
        });

        client.activate();
        setStompClient(client);
      } catch (error) {
        console.error("Failed to connect to STOMP server", error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (!stompClient) return;
      stompClient.deactivate();
      console.log("STOMP client deactivated");
    };
  }, [auth.user]);

  return (
    <StompClientContext.Provider value={{ client: stompClient, isConnected }}>
      {children}
    </StompClientContext.Provider>
  );
};
