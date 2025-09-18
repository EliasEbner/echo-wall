import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useWebSocket } from "~/hooks/useWebSocket";
import type { Message, MessageCreate } from "~/types/message";
import { API_URL } from "~/utils/constants";

export function useChat() {
  const { username } = useParams();

  const [messages, setMessages] = useState<Message[]>();
  const [composedMessage, setComposedMessage] = useState("");

  const { connected, error, message, send } = useWebSocket(
    `${API_URL}/messages/subscribe`,
  );

  useEffect(() => {
    const params = new URLSearchParams({
      limit: "30",
      offset: "0",
    });

    fetch(`${API_URL}/messages?${params}`).then((response) => {
      response.json().then((data) => {
        const tempMessages: Message[] = [];
        for (const element of data) {
          const tempMessage: Message = {
            body: element["body"],
            createdAt: element["created_at"],
            id: element["id"],
            username: element["username"],
          };
          tempMessages.push(tempMessage);
        }
        setMessages(tempMessages);
      });
    });
  }, []);

  useEffect(() => {
    if (message) {
      const tempMessage: Message = {
        body: message["body"],
        createdAt: message["created_at"],
        id: message["id"],
        username: message["username"],
      };
      if (messages) {
        setMessages([tempMessage, ...messages]);
      } else {
        setMessages([tempMessage]);
      }
    }
  }, [message, messages]);

  const onSend = useCallback(() => {
    if (composedMessage && username) {
      const data = JSON.stringify({
        username,
        body: composedMessage,
      } satisfies MessageCreate);
      console.log(data);
      send(data);
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
