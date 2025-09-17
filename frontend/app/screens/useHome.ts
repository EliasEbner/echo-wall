import { useEffect, useState } from "react";
import type { Message } from "~/types/message";
import { API_URL } from "~/utils/constants";

export function useHome() {
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    const params = new URLSearchParams({
      limit: "30",
      offset: "0",
    });

    fetch(`${API_URL}/messages?${params}`).then((response) => {
      response.json().then((data) => {
        setMessages(data);
        console.log(messages);
      });
    });
  }, []);

  return { messages };
}
