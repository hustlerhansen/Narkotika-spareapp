// @vitest-environment node
import { describe, expect, it } from "vitest";
import { decryptText, deriveKey, encryptText, isEnvelope } from "./crypto";

describe("local encryption", () => {
  it("round-trips, uses a fresh IV per save and hides the plaintext", async () => {
    const k = await deriveKey("riktig passord", undefined, 1000);
    const a = await encryptText('{"journal":"HEMMELIG"}', k);
    const b = await encryptText('{"journal":"HEMMELIG"}', k);
    expect(isEnvelope(a)).toBe(true);
    expect(a.iv).not.toBe(b.iv);
    expect(JSON.stringify(a)).not.toContain("HEMMELIG");
    expect(await decryptText(a, k.key)).toBe('{"journal":"HEMMELIG"}');
  });

  it("rejects a wrong password and tampered ciphertext", async () => {
    const k = await deriveKey("riktig passord", undefined, 1000);
    const env = await encryptText("data", k);
    const wrong = await deriveKey("feil passord", env.salt, env.iter);
    await expect(decryptText(env, wrong.key)).rejects.toThrow();
    const tampered = { ...env, ct: env.ct.slice(0, -4) + (env.ct.endsWith("AAAA") ? "BBBB" : "AAAA") };
    await expect(decryptText(tampered, k.key)).rejects.toThrow();
  });

  it("re-derives the same key from the stored salt", async () => {
    const k = await deriveKey("pw-123456", undefined, 1000);
    const env = await encryptText("x", k);
    const again = await deriveKey("pw-123456", env.salt, env.iter);
    expect(await decryptText(env, again.key)).toBe("x");
  });
});
