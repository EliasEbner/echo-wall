import { useEffect, useRef, useState } from "react";

type WsState = {
  connected: boolean;
  message: any | null;
  error: Event | null;
};

export function useWebSocket(url: string) {
  const [state, setState] = useState<WsState>({
    connected: false,
    message: null,
    error: null,
  });
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!url) return;

    const connect = () => {
      const socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () =>
        setState((s) => ({ ...s, connected: true, error: null }));

      socket.onmessage = (e) =>
        setState((s) => ({ ...s, message: JSON.parse(e.data) }));

      socket.onclose = () => {
        setState((s) => ({ ...s, connected: false }));
        // attempts to reconnect after 2s
        reconnectTimeout.current = window.setTimeout(connect, 2000);
      };

      socket.onerror = (err) => setState((s) => ({ ...s, error: err }));
    };

    connect();

    // cleanup on unmount
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) {
        ws.current.onclose = null; // suppress artificial close event
        ws.current.close();
      }
    };
  }, [url]);

  const send = (obj: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(obj));
    }
  };

  return { ...state, send };
}
