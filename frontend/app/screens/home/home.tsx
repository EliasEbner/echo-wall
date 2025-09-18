import { TextInput } from "~/components/textInput/textInput";
import { useHome } from "./useHome";
import { Button } from "~/components/button/button";

export default function Home() {
  const { setUsername, username, onEnterChat } = useHome();
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
      <TextInput label="Username" onChange={setUsername} value={username} />
      <Button onClick={onEnterChat}>Go to chat</Button>
    </div>
  );
}
