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
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
      <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2">
        <Box>
          <div className="overflow-y-auto">
            {messages?.map((message, index) => (
              <>
                {new Date(message.createdAt).getDate() !==
                  new Date(messages[index - 1]?.createdAt).getDate() && (
                  <div className="flex flex-row items-center gap-4 pt-8 pb-2">
                    <div className="h-px dark:bg-neutral-700 bg-neutral-300 grow" />
                    <div className="text-sm text-font-secondary">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                    <div className="h-px dark:bg-neutral-700 bg-neutral-300 grow" />
                  </div>
                )}
                <div
                  key={`message-${message.id}`}
                  className="flex justify-between items-start"
                >
                  <div className="w-4/5 flex flex-row gap-4">
                    <span className="font-bold w-16 overflow-ellipsis">
                      {message.username}:
                    </span>
                    <p>{message.body}</p>
                  </div>
                  <span className="text-font-secondary text-xs pr-2 w-30">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </>
            ))}
          </div>
        </Box>
      </div>
      <div className="flex flex-row gap-2 items-end">
        <TextInput
          onChange={setComposedMessage}
          value={composedMessage}
          label="Message"
        />
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  );
}
