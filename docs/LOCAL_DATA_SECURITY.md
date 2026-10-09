# Local data security assessment

NY START stores recovery data **on the device** (web: `localStorage`). This document assesses the risks honestly and describes the protections.

## Default mode: NOT encrypted

`localStorage` is plain storage inside the browser profile. It is **not encrypted by the app** and must never be described as encrypted or fully secure.

| Threat | Exposure in default mode | Mitigation |
|---|---|---|
| Shared device / other people using the same browser profile | Readable by anyone who opens the app or the browser's developer tools | Warning in Profile; one-tap "Slett alle data"; optional passphrase protection (below) |
| Device theft | Readable if the device/browser profile is unlocked | Device lock (OS); optional passphrase protection; OS disk encryption |
| Browser extensions with page access | Can read page content and storage while the app is open | Cannot be fully mitigated by a web app; documented; recommend a dedicated browser profile |
| Cross-site scripting (XSS) | Would expose all data | No third-party scripts; React escaping; strict-ish CSP (`script-src 'self' 'unsafe-inline'` – nonce-based CSP is R-19); no `dangerouslySetInnerHTML` except the static pre-paint script |
| Browser sync/backups | Some browsers back up site data with the profile | Documented; passphrase protection keeps backups encrypted |
| Service-worker cache | Contains only static pages (no personal data) | Personal data is rendered client-side from storage; `/api/*` never cached |
| Logs / analytics / crash reports | None collected | `no-console` lint rule; no analytics; server logs only error names/issue codes |

## Optional passphrase protection ("Beskytt dataene med passord")

- **Opt-in only.** Never enabled silently. Before enabling, the user sees: *"Glemmer du passordet, kan dataene IKKE gjenopprettes"*, must tick an explicit acknowledgement, and is offered "Last ned en kopi først".
- **Crypto:** AES-GCM-256; key derived with PBKDF2-SHA-256, 600 000 iterations, random 16-byte salt; fresh 12-byte IV per save; WebCrypto, non-extractable key.
- **Key management:** the key exists only in memory while unlocked. It is never stored. A page reload or closed tab locks the app again; "Lås nå" locks immediately.
- **Locked behaviour:** personal pages show the lock screen; SOS and emergency numbers work without the password; the store refuses all writes while locked, so protected data cannot be overwritten (including by onboarding).
- **Display preferences** (theme, text size, contrast, motion) are stored unencrypted so the lock screen respects accessibility settings. They contain no health data.
- **Recovery:** none by design. "Glemt passordet?" explains this and offers deleting everything to start over.
- **Limits:** does not protect against malware, malicious extensions or XSS while unlocked, or against someone who learns the password. Password strength is the user's choice (minimum 8 characters).

## Tests

- Unit: `apps/web/src/lib/crypto.test.ts` (round trip, unique IVs, ciphertext hides plaintext, wrong password, tampering, re-derivation), `storage.test.ts` (corrupt data never overwritten, encrypted envelope loads as locked, unavailable storage).
- E2E: `apps/web/e2e/security.spec.ts` (enable, plaintext absent from storage, lock on reload, SOS while locked, onboarding blocked while locked, wrong password, unlock, new writes encrypted, forgotten-password reset).

## Native app (future)

Use platform secure storage (Keychain/Keystore via `expo-secure-store`) for the key and encrypted files for data, with biometric unlock as an option.
