import Anthropic from "@anthropic-ai/sdk";
import type { AiProvider, GenerateRequest } from "@nystart/core";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
 * Anthropic Messages API provider. Imported by the server route (via anthropic-provider.ts,
 * which adds the `server-only` guard) and by the offline evaluation harness (scripts/ai-eval.ts).
 * - Server-side refusal fallback ("default" routing) is enabled so a policy decline is re-run
 *   on a suitable model inside the same call.
 * - A remaining refusal yields an empty string → output validation replaces it with a safe fallback.
 */
export class AnthropicProvider implements AiProvider {
  readonly id = "anthropic";
  readonly isMock = false;
  /** Token usage of the most recent call (for the evaluation harness and cost estimates). */
  lastUsage: TokenUsage | null = null;
  private readonly client: Anthropic;

  constructor(
    private readonly model: string,
    apiKey?: string,
  ) {
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
    this.lastUsage = { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens };
    if (response.stop_reason === "refusal") return "";
    return response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
  }
}
