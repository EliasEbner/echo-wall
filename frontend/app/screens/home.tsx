import { Box } from "~/components/Box/box";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <Box>Chat</Box>
      <Box>Write a message...</Box>
    </div>
  );
}
