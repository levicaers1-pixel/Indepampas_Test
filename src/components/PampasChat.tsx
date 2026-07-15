import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const STORAGE_KEY = "pampas-chat-history-v1";
const SUGGESTIONS = [
  "Welke baan lijkt op Ternesse maar goedkoper?",
  "Beste baan onder €80 in Vlaanderen?",
  "Welke baan zou Levi kiezen voor een weekendje?",
  "Wat is de hoogst gescoorde links-baan?",
];

function loadHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UIMessage[];
  } catch {
    return [];
  }
}

function saveHistory(messages: UIMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* quota, ignore */
  }
}

export function PampasChat() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setInitialMessages(loadHistory());
    setMounted(true);
  }, []);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "pampas-single",
    messages: initialMessages,
    transport,
  });

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    saveHistory(messages);
  }, [messages, mounted]);

  useEffect(() => {
    if (open && textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    await sendMessage({ text: trimmed });
  };

  const clearChat = () => {
    setMessages([]);
    saveHistory([]);
  };

  if (!mounted) return null;

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Sluit PAMPAS AI" : "Open PAMPAS AI"}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#1C3D2A] text-[#8FBF4A] shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center justify-center hover:bg-[#2B5C3E] transition-all hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#8FBF4A]" />
          </div>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[min(400px,calc(100vw-3rem))] h-[min(600px,calc(100vh-8rem))] bg-[#F4EFE5] border border-[rgba(28,61,42,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden rounded-sm">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[rgba(28,61,42,0.15)] bg-[#1C3D2A] text-[#F4EFE5] flex items-center justify-between">
            <div>
              <p className="font-rb-mono text-[0.55rem] tracking-[0.2em] uppercase text-[#8FBF4A]">
                Vraag het
              </p>
              <h3 className="font-rb-serif text-lg leading-tight">PAMPAS AI</h3>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="font-rb-mono text-[0.55rem] tracking-[0.15em] uppercase text-[rgba(244,239,229,0.6)] hover:text-[#8FBF4A]"
              >
                Wissen
              </button>
            )}
          </div>

          {/* Messages */}
          <Conversation className="flex-1 bg-[#F4EFE5]">
            <ConversationContent className="px-4 py-4">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <p className="font-rb-serif text-lg text-[#1C3D2A] mb-2">
                    Hoi! Ik ken alle 183 banen uit de PAMPAS kennisbank.
                  </p>
                  <p className="font-rb-sans text-xs text-[#635C4B] mb-5">
                    Vraag me wat je wil weten over Belgische, Nederlandse of Franse banen.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSubmit(s)}
                        className="text-left px-3 py-2 text-xs bg-white/50 hover:bg-white border border-[rgba(28,61,42,0.15)] text-[#1C3D2A] font-rb-sans transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => {
                const isUser = m.role === "user";
                const text = m.parts
                  .map((p: any) => (p.type === "text" ? p.text : ""))
                  .join("");
                return (
                  <Message from={m.role} key={m.id}>
                    {isUser ? (
                      <MessageContent className="bg-[#1C3D2A] text-[#F4EFE5]">
                        <div className="whitespace-pre-wrap">{text}</div>
                      </MessageContent>
                    ) : (
                      <MessageContent className="!bg-transparent !p-0 text-[#1C3D2A]">
                        <MessageResponse>{text}</MessageResponse>
                      </MessageContent>
                    )}
                  </Message>
                );
              })}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="px-2 py-2">
                  <Shimmer>PAMPAS AI denkt na...</Shimmer>
                </div>
              )}

              {error && (
                <div className="mt-3 border border-red-500/40 bg-red-500/10 text-red-800 text-xs px-3 py-2">
                  Er ging iets mis: {error.message}
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Composer */}
          <div className="border-t border-[rgba(28,61,42,0.15)] bg-white p-3">
            <PromptInput
              onSubmit={(message) => {
                handleSubmit(message.text ?? input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Vraag over een baan, host of vergelijking..."
                disabled={isLoading}
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() || isLoading} />
              </PromptInputFooter>
            </PromptInput>
            <p className="font-rb-mono text-[0.5rem] tracking-[0.15em] uppercase text-[#8A8270] mt-2 text-center">
              AI-antwoorden op basis van PAMPAS reviews · kunnen fouten bevatten
            </p>
          </div>
        </div>
      )}
    </>
  );
}
