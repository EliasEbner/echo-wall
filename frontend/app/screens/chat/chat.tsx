import { Box } from "~/components/box/box";
import { useChat } from "./useChat";
import { TextInput } from "~/components/textInput/textInput";
import { Button } from "~/components/button/button";

export default function Chat() {
  const {
    messages,
    connected,
    error,
    onSend,
    setComposedMessage,
    composedMessage,
  } = useChat();

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <Box>
        {messages?.map((message) => (
          <div key={`message-${message.id}`}>
            {message.username} {message.body}
          </div>
        ))}
      </Box>
      <div className="flex flex-row gap-2">
        <TextInput
          onChange={setComposedMessage}
          value={composedMessage}
          label="message"
        />
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  );
}
