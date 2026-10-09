/**
 * Provider abstraction. The real provider lives server-side only
 * (apps/web/src/lib/server/ai). Core contains the interface and a
 * deterministic mock used for tests and the "test mode".
 */
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface GenerateRequest {
  system: string;
  turns: ChatTurn[];
  maxTokens: number;
}

export interface AiProvider {
  readonly id: string;
  /** True for providers that do not call a real model (shown to the user). */
  readonly isMock: boolean;
  generate(req: GenerateRequest): Promise<string>;
}

/** Deterministic, supportive replies – never claims to be a real AI. */
export class MockProvider implements AiProvider {
  readonly id = "mock";
  readonly isMock = true;
  constructor(private readonly override?: (req: GenerateRequest) => string) {}

  async generate(req: GenerateRequest): Promise<string> {
    if (this.override) return this.override(req);
    const last = req.turns.filter((t) => t.role === "user").at(-1)?.content.toLowerCase() ?? "";
    if (/russug|sug|lyst/.test(last)) {
      return "Takk for at du sier det. Russug kan være sterkt, men du trenger ikke handle på det. Vil du prøve pusteøvelsen eller timeren i SOS, eller sende en melding til en du stoler på? Hva pleier å hjelpe deg litt?";
    }
    if (/sov|søvn|trøtt|sliten/.test(last)) {
      return "Søvn kan være vanskelig i en periode. Faste tider, lite skjerm før leggetid og litt bevegelse på dagtid hjelper noen. Hvis søvnproblemene varer, kan det være lurt å snakke med fastlegen.";
    }
    return "Takk for at du deler. Hva er det viktigste for deg akkurat nå? Vi kan se på ett lite steg du kan ta i dag.";
  }
}

/** Provider that refuses – used whenever AI is disabled. */
export class DisabledProvider implements AiProvider {
  readonly id = "disabled";
  readonly isMock = true;
  async generate(): Promise<string> {
    throw new Error("AI is disabled");
  }
}
