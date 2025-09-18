import { Box } from "~/components/box/box";
import type { Route } from "../../+types/root";
import { useChat } from "./useChat";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Chat() {
  const { messages } = useChat();

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <Box>
        {messages?.map((message) => (
          <>
            {message.username} {message.body}
          </>
        ))}
      </Box>
      <Box>Write a message...</Box>
    </div>
  );
}
