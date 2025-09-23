import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useWebSocket } from "~/hooks/useWebSocket";
import type { Message, MessageCreate } from "~/types/message";
import { API_URL, WS_URL } from "~/utils/constants";

export function useChat() {
  const { username } = useParams();

  const [messages, setMessages] = useState<Message[]>();
  const [composedMessage, setComposedMessage] = useState("");

  const { connected, error, send } = useWebSocket<Message>(
    `${WS_URL}/messages/subscribe`,
    setMessages,
  );

  useEffect(() => {
    const params = new URLSearchParams({
      limit: "100",
      offset: "0",
    });

    fetch(`${API_URL}/messages?${params}`).then((response) => {
      response.json().then((data) => {
        const tempMessages: Message[] = [];
        for (const element of data) {
          const tempMessage: Message = {
            body: element["body"],
            createdAt: element["createdAt"],
            id: element["id"],
            username: element["username"],
          };
          tempMessages.push(tempMessage);
        }
        setMessages(tempMessages);
      });
    });
  }, []);

  const onSend = useCallback(() => {
    if (composedMessage && username) {
      const data = {
        username,
        body: composedMessage,
      } satisfies MessageCreate;
      send(data);
      setComposedMessage("");
    }
  }, [composedMessage, send, username]);

  return {
    messages,
    connected,
    error,
    onSend,
    setComposedMessage,
    composedMessage,
  };
}
