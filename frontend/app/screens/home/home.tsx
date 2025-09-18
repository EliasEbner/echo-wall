import { TextInput } from "~/components/textInput/textInput";
import { useHome } from "./useHome";

export default function Home() {
  const { setUsername, username } = useHome();
  return (
    <div className="flex justify-center items-center w-full h-full">
      <TextInput label="Username" onChange={setUsername} value={username} />
    </div>
  );
}
