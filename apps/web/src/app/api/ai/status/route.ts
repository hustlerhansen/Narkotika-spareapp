import { statusResponse } from "@/lib/server/ai/chat-handler";
import { chatDeps } from "@/lib/server/ai/deps";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  const deps = chatDeps();
  return statusResponse(deps.enabled, deps.provider.isMock);
}
