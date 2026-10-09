/**
 * Optional passphrase protection for the local store.
 *
 * - AES-GCM-256 with a key derived by PBKDF2-SHA-256 (600 000 iterations,
 *   random 16-byte salt). A fresh 12-byte IV is used for every save.
 * - The derived key is non-extractable and kept in memory only; it is never
 *   written anywhere. Forgetting the passphrase means the data cannot be
 *   recovered – the UI says so explicitly before encryption is enabled.
 * - Limits: does not protect against malware, malicious browser extensions or
 *   XSS while the app is unlocked (docs/LOCAL_DATA_SECURITY.md).
 */
export const ENVELOPE_FORMAT = "nystart-aesgcm-v1";
export const PBKDF2_ITERATIONS = 600_000;

export interface Envelope {
  enc: typeof ENVELOPE_FORMAT;
  iter: number;
  salt: string;
  iv: string;
  ct: string;
}

function b64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function unb64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function cryptoSupported(): boolean {
  return typeof globalThis.crypto?.subtle?.deriveKey === "function";
}

export function isEnvelope(value: unknown): value is Envelope {
  const v = value as Envelope;
  return Boolean(v && typeof v === "object" && v.enc === ENVELOPE_FORMAT && v.salt && v.iv && v.ct && v.iter > 0);
}

export interface DerivedKey {
  key: CryptoKey;
  salt: string;
  iter: number;
}

export async function deriveKey(password: string, saltB64?: string, iter = PBKDF2_ITERATIONS): Promise<DerivedKey> {
  const salt = saltB64 ? unb64(saltB64) : crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)));
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: iter },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  return { key, salt: b64(salt), iter };
}

export async function encryptText(plain: string, k: DerivedKey): Promise<Envelope> {
  const iv = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(12)));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k.key, new TextEncoder().encode(plain)));
  return { enc: ENVELOPE_FORMAT, iter: k.iter, salt: k.salt, iv: b64(iv), ct: b64(ct) };
}

/** Throws on a wrong key or tampered data (AES-GCM authentication). */
export async function decryptText(env: Envelope, key: CryptoKey): Promise<string> {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(env.iv) }, key, unb64(env.ct));
  return new TextDecoder().decode(plain);
}
