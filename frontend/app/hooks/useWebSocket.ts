import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";

export type WsState<T = unknown> = {
  connected: boolean;
  lastMessage: T | null;
  error: Event | null;
};

const MAX_RECONNECTS = 10;
const RECONNECT_DELAY = 2_000;

export function useWebSocket<T = unknown>(
  url: string | null,
  setState: Dispatch<SetStateAction<T[] | undefined>>,
  protocols?: string | string[],
) {
  /* ---------- state ---------- */
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);

  /* ---------- socket bookkeeping ---------- */
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<number | null>(null);
  const outboundBuffer = useRef<string[]>([]);

  /* ---------- public send ---------- */
  const send = useCallback((obj: unknown) => {
    const payload = JSON.stringify(obj);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(payload);
    } else {
      outboundBuffer.current.push(payload); // buffer until open
    }
  }, []);

  /* ---------- socket life-cycle ---------- */
  useEffect(() => {
    if (!url) return;

    const connect = () => {
      if (reconnectCount.current >= MAX_RECONNECTS) return;

      const socket = new WebSocket(url, protocols);
      ws.current = socket;

      socket.onopen = () => {
        reconnectCount.current = 0;
        setConnected(true);
        setError(null);

        /* drain outbound buffer */
        while (
          outboundBuffer.current.length &&
          socket.readyState === WebSocket.OPEN
        ) {
          socket.send(outboundBuffer.current.shift()!);
        }
      };

      socket.onmessage = (e) => {
        try {
          const parsed: T = JSON.parse(e.data);
          setState((state) => [...(state ?? []), parsed]);
        } catch (err) {
          console.error("[WS] invalid JSON", e.data, err);
        }
      };

      socket.onerror = (ev) => {
        console.error("[WS] error", ev);
        setError(ev);
      };

      socket.onclose = () => {
        setConnected(false);
        reconnectCount.current += 1;
        reconnectTimer.current = window.setTimeout(connect, RECONNECT_DELAY);
      };
    };

    connect();

    /* ---------- cleanup ---------- */
    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      reconnectCount.current = 0;
      outboundBuffer.current = [];

      if (ws.current) {
        ws.current.onclose = null;
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
    };
  }, [url, protocols, setState]);

  return { connected, error, send } as const;
}
