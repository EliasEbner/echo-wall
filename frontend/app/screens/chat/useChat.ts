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
        setMessages(data);
      });
    });
  }, []);

  useEffect(() => {
    if (messages) {
      setMessages([message, ...messages]);
    } else {
      setMessages([message]);
    }
  }, [message]);

  const onSend = useCallback(() => {
    if (composedMessage && username) {
      send({ username, body: composedMessage } satisfies MessageCreate);
    }
  }, [composedMessage]);

  return { messages, connected, error, onSend };
}
