import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AiProvider, GenerateRequest } from "@nystart/core";

/**
 * Anthropic Messages API provider (server-side only – the API key never
 * reaches the browser).
 * - Server-side refusal fallback ("default" routing) is enabled so a policy
 *   decline is re-run on a suitable model inside the same call.
 * - A remaining refusal yields an empty string → the handler's output
 *   validation replaces it with a safe fallback message.
 */
export class AnthropicProvider implements AiProvider {
  readonly id = "anthropic";
  readonly isMock = false;
  private readonly client: Anthropic;

  constructor(private readonly model: string, apiKey?: string) {
    this.client = new Anthropic({ apiKey, timeout: 60_000, maxRetries: 1 });
  }

  async generate(req: GenerateRequest): Promise<string> {
    const response = await this.client.beta.messages.create({
      model: this.model,
      max_tokens: req.maxTokens,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: req.system,
      messages: req.turns.map((t) => ({ role: t.role, content: t.content })),
    });
    if (response.stop_reason === "refusal") return "";
    return response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
  }
}
