import { Box } from "~/components/Box/box";
import type { Route } from "../+types/root";
import { useHome } from "./useHome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { messages } = useHome();

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
