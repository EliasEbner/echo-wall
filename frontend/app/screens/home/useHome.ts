import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

export function useHome() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const onEnterChat = useCallback(() => {
    if (username !== "") {
      navigate(`/chat/${username}`);
    }
  }, [username, navigate]);

  return { username, setUsername, onEnterChat };
}
