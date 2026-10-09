import { handleChat } from "@/lib/server/ai/chat-handler";
import { chatDeps } from "@/lib/server/ai/deps";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  return handleChat(req, chatDeps());
}
