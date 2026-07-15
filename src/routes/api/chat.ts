import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider, embedText } from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `Je bent PAMPAS AI — de kennisbank-assistent van de Belgische golfpodcast PAMPAS.

Je hebt kennis van 183+ golfbanen (België, Nederland, Frankrijk) plus de reviews van de drie hosts:
- Lars: HCP-speler met een strenge, kritische kijk. Waardeert ontwerp en uitdaging.
- Levi: technische pro-persona. Focust op onderhoud, greens en pure golf-kwaliteit.
- Niels: romanticus, houdt van sfeer, landschap en gastvrijheid.

REGELS:
- Antwoord in het Nederlands, warm en informeel maar to-the-point.
- Baseer je ALLEEN op de context hieronder. Verzin geen banen, scores of quotes.
- Bij vergelijkingen (bv "zoals X maar goedkoper"): som 2-3 concrete alternatieven op met naam, PAMPAS Score, greenfee en 1 zin waarom.
- Vermeld bronnen aan het einde als: "Bronnen: [Baan1], [Baan2]" — enkel banen die je écht gebruikt hebt.
- Als je iets niet weet, zeg dat eerlijk en stel voor welke aflevering ze kunnen beluisteren.
- Gebruik markdown: **bold** voor baannamen, lijstjes waar zinnig.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as ChatRequestBody;
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("Messages are required", { status: 400 });
          }

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          // Get the latest user message text
          const lastUser = [...(messages as UIMessage[])]
            .reverse()
            .find((m) => m.role === "user");
          const userText =
            lastUser?.parts
              ?.map((p: any) => (p.type === "text" ? p.text : ""))
              .join(" ")
              .trim() ?? "";

          // 1. Embed the query
          let contextBlock = "";
          if (userText) {
            try {
              const [queryVec] = await embedText(userText, apiKey);
              const supabase = createClient(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_PUBLISHABLE_KEY!,
                { auth: { persistSession: false, autoRefreshToken: false } },
              );
              const { data: matches } = await supabase.rpc("match_rag_chunks", {
                query_embedding: queryVec as unknown as string,
                match_count: 10,
              });
              if (matches && matches.length) {
                contextBlock =
                  "\n\nCONTEXT (top matches uit de PAMPAS kennisbank):\n\n" +
                  (matches as any[])
                    .map(
                      (m, i) =>
                        `[${i + 1}] ${m.source_type === "course" ? "BAAN" : "REVIEW"} — ${m.course_name}\n${m.content}`,
                    )
                    .join("\n\n---\n\n");
              }
            } catch (e) {
              console.error("[chat] RAG lookup failed:", e);
            }
          }

          const gateway = createLovableAiGatewayProvider(apiKey);
          const model = gateway("google/gemini-3.5-flash");

          const result = streamText({
            model,
            system: SYSTEM_PROMPT + contextBlock,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err: any) {
          console.error("[chat] error:", err);
          return new Response(
            JSON.stringify({ error: err?.message ?? "Onbekende fout" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
