import { describe, expect, it } from "vitest";
import { authErrorKey, isPlausibleEmail, safeRedirectPath, validatePassword, validateSignIn, validateSignUp } from "./account";

const valid = { email: "kari@example.no", password: "a-long-passphrase", repeat: "a-long-passphrase", adult: true, terms: true };

describe("account validation", () => {
  it("accepts a complete sign-up", () => {
    expect(validateSignUp(valid)).toBeNull();
  });

  it("requires 18+ and terms confirmation", () => {
    expect(validateSignUp({ ...valid, adult: false })).toBe("errorRequired");
    expect(validateSignUp({ ...valid, terms: false })).toBe("errorRequired");
  });

  it("rejects short, overlong and mismatched passwords", () => {
    expect(validatePassword("short")).toBe("errorWeakPassword");
    expect(validatePassword("x".repeat(73))).toBe("errorWeakPassword");
    expect(validatePassword("0123456789")).toBeNull();
    expect(validateSignUp({ ...valid, repeat: "something-else" })).toBe("errorMismatch");
  });

  it("checks e-mail plausibility", () => {
    expect(isPlausibleEmail(" kari@example.no ")).toBe(true);
    expect(isPlausibleEmail("kari@")).toBe(false);
    expect(isPlausibleEmail("kari example.no")).toBe(false);
    expect(validateSignIn({ email: "kari@example.no", password: "" })).toBe("errorRequired");
  });
});

describe("authErrorKey", () => {
  it("does not reveal whether an account exists or is unconfirmed", () => {
    expect(authErrorKey({ code: "invalid_credentials", status: 400 })).toBe("errorCredentials");
    expect(authErrorKey({ code: "email_not_confirmed", status: 400 })).toBe("errorCredentials");
  });

  it("maps rate limits and weak passwords", () => {
    expect(authErrorKey({ status: 429 })).toBe("errorRateLimited");
    expect(authErrorKey({ code: "over_email_send_rate_limit", status: 429 })).toBe("errorRateLimited");
    expect(authErrorKey({ code: "weak_password", status: 422 })).toBe("errorWeakPassword");
    expect(authErrorKey({ code: "reauthentication_needed", status: 400 })).toBe("errorReauth");
    expect(authErrorKey({ code: "same_password", status: 422 })).toBe("errorSamePassword");
    expect(authErrorKey({ code: "unexpected_failure", status: 500 })).toBe("errorGeneric");
    expect(authErrorKey(null)).toBe("errorGeneric");
  });
});

describe("safeRedirectPath", () => {
  it("allows only whitelisted internal paths", () => {
    expect(safeRedirectPath("/nytt-passord")).toBe("/nytt-passord");
    expect(safeRedirectPath("/profil?x=1")).toBe("/profil");
  });

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "/verktoy/dagbok", "javascript:alert(1)", "", null, undefined])(
    "falls back to /profil for %s",
    (next) => {
      expect(safeRedirectPath(next)).toBe("/profil");
    },
  );
});
