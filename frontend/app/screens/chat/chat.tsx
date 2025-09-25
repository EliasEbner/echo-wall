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
    messageInputOnKeyDown,
    dummyScrollRef,
  } = useChat();

  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center items-center">
      <div className="w-full md:w-5/6 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
        <Box>
          <div className="max-h-[70vh] overflow-y-auto">
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
                  className="grid grid-cols-12 grid-flow-row gap-2"
                >
                  <span className="col-span-3 sm:col-span-2 flex flex-row">
                    <span className="font-bold truncate">
                      {message.username}
                    </span>
                  </span>
                  <p className="col-span-9 sm:col-span-8">{message.body}</p>
                  <span className="text-font-secondary text-xs pr-2 hidden sm:block sm:col-span-2 pt-1 text-right">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </>
            ))}
            <div ref={dummyScrollRef} />
          </div>
        </Box>
      </div>
      <div className="flex flex-row gap-2 items-end">
        <TextInput
          onChange={setComposedMessage}
          value={composedMessage}
          label="Message"
          onKeyDown={messageInputOnKeyDown}
        />
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  );
}
