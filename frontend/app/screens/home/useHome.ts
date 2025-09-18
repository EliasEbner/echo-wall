import React, { useCallback, useState } from "react";

export function useHome() {
  const [username, setUsername] = useState("");

  return { username, setUsername };
}
