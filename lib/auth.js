// lib/auth.js
//
// Centralized browser-side Supabase auth helpers for the archive.
//
// Every supabase.auth.* call the login / signup pages need lives here so the
// pages stay thin and the email and phone flows behave exactly the same way.
// Nothing in this file touches the database, RLS policies, or the
// review_entry / is_reviewer functions — it only talks to Supabase Auth.

import { createClient } from "./supabase/client.js";

// Identifier kinds a contributor can sign up / log in with.
export const IDENTIFIER_EMAIL = "email";
export const IDENTIFIER_PHONE = "phone";

// Ways to sign in with a phone number.
export const PHONE_METHOD_PASSWORD = "password";
export const PHONE_METHOD_OTP = "otp";

// Supabase sends a six-digit SMS code by default.
export const OTP_CODE_LENGTH = 6;

// The archive is rooted in Cambodia, so a bare local number such as
// 012 345 678 is understood as +855 12 345 678.
const CAMBODIA_DIAL_CODE = "+855";

/**
 * Normalize a phone number to E.164 form for Supabase.
 *  - "012 345 678"       -> "+85512345678"
 *  - "855 12 345 678"    -> "+85512345678"
 *  - "+855 12 345 678"   -> "+85512345678"
 * Non-digit characters are dropped; anything unrecognized keeps a leading "+".
 */
export function normalizePhone(raw) {
  if (raw === null || raw === undefined) return "";

  const trimmed = String(raw).trim();
  if (!trimmed) return "";

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (trimmed.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("855")) return `+${digits}`;
  if (digits.startsWith("0")) return `${CAMBODIA_DIAL_CODE}${digits.slice(1)}`;
  return `+${digits}`;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

export function isValidPhone(value) {
  return /^\+\d{7,15}$/.test(normalizePhone(value));
}

function getClient() {
  return createClient();
}

function notConfigured() {
  return { data: null, error: { code: "not_configured" } };
}

export async function signInWithEmail(email, password) {
  const supabase = getClient();
  if (!supabase) return notConfigured();
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
}

export async function signUpWithEmail(email, password) {
  const supabase = getClient();
  if (!supabase) return notConfigured();
  return supabase.auth.signUp({ email: email.trim(), password });
}

export async function signInWithPhone(phone, password) {
  const supabase = getClient();
  if (!supabase) return notConfigured();
  return supabase.auth.signInWithPassword({
    phone: normalizePhone(phone),
    password,
  });
}

export async function signUpWithPhone(phone, password) {
  const supabase = getClient();
  if (!supabase) return notConfigured();
  return supabase.auth.signUp({
    phone: normalizePhone(phone),
    password,
    options: { channel: "sms" },
  });
}

/**
 * Send an SMS one-time code to a phone number.
 * `createUser: false` keeps the login page from silently creating accounts.
 */
export async function sendPhoneOtp(phone, { createUser = false } = {}) {
  const supabase = getClient();
  if (!supabase) return notConfigured();
  return supabase.auth.signInWithOtp({
    phone: normalizePhone(phone),
    options: { shouldCreateUser: createUser },
  });
}

export async function verifyPhoneOtp(phone, token) {
  const supabase = getClient();
  if (!supabase) return notConfigured();
  return supabase.auth.verifyOtp({
    phone: normalizePhone(phone),
    token: String(token).trim(),
    type: "sms",
  });
}

/**
 * Translate a Supabase auth error into an i18n key so both languages stay in
 * sync and the raw (English-only) provider message is never shown. Falls back
 * to a generic "something went wrong" key for anything unrecognized.
 */
export function authErrorKey(error, identifier = IDENTIFIER_EMAIL) {
  if (!error) return "";
  if (error.code === "not_configured") return "contributeAuthNotConfigured";

  const code = String(error.code || "").toLowerCase();
  const message = String(error.message || "").toLowerCase();

  const mentionsPhone = message.includes("phone") || message.includes("sms");
  const phoneBlocked =
    message.includes("disabled") ||
    message.includes("not enabled") ||
    message.includes("not configured") ||
    message.includes("unsupported") ||
    message.includes("provider") ||
    message.includes("error sending") ||
    message.includes("failed") ||
    message.includes("error");

  if ((mentionsPhone && phoneBlocked) || code === "phone_provider_disabled") {
    return "authPhoneNotEnabled";
  }
  if (code === "phone_exists" || message.includes("phone number already")) {
    return "authPhoneExists";
  }
  if (code === "email_exists" || code === "user_already_exists") {
    return "authEmailExists";
  }
  if (
    code === "otp_expired" ||
    message.includes("expired") ||
    message.includes("invalid token") ||
    message.includes("invalid otp")
  ) {
    return "authOtpInvalidCode";
  }
  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return identifier === IDENTIFIER_PHONE
      ? "authInvalidPhoneCredentials"
      : "authInvalidCredentials";
  }
  if (code.includes("rate_limit") || message.includes("too many") || message.includes("rate limit")) {
    return "authRateLimited";
  }
  if (message.includes("password") && (message.includes("at least") || message.includes("short"))) {
    return "authPasswordTooShort";
  }
  return "authGenericError";
}
