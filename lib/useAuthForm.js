"use client";

// lib/useAuthForm.js
//
// Shared state machine behind the Log In and Sign Up pages. Keeping it in one
// hook means the email and phone flows (and the OTP step) behave identically
// on both pages and the pages themselves stay small and readable.

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IDENTIFIER_EMAIL,
  IDENTIFIER_PHONE,
  OTP_CODE_LENGTH,
  PHONE_METHOD_OTP,
  PHONE_METHOD_PASSWORD,
  authErrorKey,
  isValidEmail,
  isValidPhone,
  normalizePhone,
  sendPhoneOtp,
  signInWithEmail,
  signInWithPhone,
  signUpWithEmail,
  signUpWithPhone,
  verifyPhoneOtp,
} from "./auth.js";

const MIN_PASSWORD_LENGTH = 6;

export function useAuthForm(mode) {
  const isSignup = mode === "signup";
  const router = useRouter();

  const [identifier, setIdentifier] = useState(IDENTIFIER_EMAIL);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneMethod, setPhoneMethod] = useState(PHONE_METHOD_PASSWORD);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [noticeKey, setNoticeKey] = useState("");

  const isEmail = identifier === IDENTIFIER_EMAIL;
  const isPhone = identifier === IDENTIFIER_PHONE;
  const usingOtp = isPhone && phoneMethod === PHONE_METHOD_OTP && !isSignup;
  const showOtp = isPhone && otpSent;
  const showPassword = !showOtp && (isEmail || !usingOtp);

  const clearStatus = () => {
    setErrorKey("");
    setNoticeKey("");
  };

  const changeIdentifier = (next) => {
    if (next === identifier) return;
    setIdentifier(next);
    setPhoneMethod(PHONE_METHOD_PASSWORD);
    setOtpSent(false);
    setOtpCode("");
    clearStatus();
  };

  const changePhoneMethod = (next) => {
    setPhoneMethod(next);
    setOtpSent(false);
    setOtpCode("");
    clearStatus();
  };

  const requirePassword = () => {
    if (isSignup && password.length < MIN_PASSWORD_LENGTH) {
      setErrorKey("authPasswordTooShort");
      return false;
    }
    return true;
  };

  const startOtp = async (createUser) => {
    if (!isValidPhone(phone)) {
      setErrorKey("authInvalidPhone");
      return;
    }
    clearStatus();
    setLoading(true);
    const { error } = await sendPhoneOtp(phone, { createUser });
    setLoading(false);
    if (error) {
      setErrorKey(authErrorKey(error, IDENTIFIER_PHONE));
      return;
    }
    setOtpPhone(normalizePhone(phone));
    setOtpCode("");
    setOtpSent(true);
  };

  const submit = async (event) => {
    if (event) event.preventDefault();
    clearStatus();

    // Pressing Enter on the OTP screen must verify, not start a new sign-in.
    if (showOtp) {
      await verifyOtp();
      return;
    }

    if (isEmail) {
      if (!isValidEmail(email)) {
        setErrorKey("authInvalidEmail");
        return;
      }
      if (!requirePassword()) return;

      setLoading(true);
      const { data, error } = isSignup
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);
      setLoading(false);

      if (error) {
        setErrorKey(authErrorKey(error, IDENTIFIER_EMAIL));
        return;
      }
      if (isSignup && !data?.session) {
        setNoticeKey("authSignupSuccess");
        return;
      }
      router.push(isSignup ? "/login" : "/");
      return;
    }

    // Phone identifier ------------------------------------------------------
    if (!isValidPhone(phone)) {
      setErrorKey("authInvalidPhone");
      return;
    }
    if (usingOtp) {
      await startOtp(false);
      return;
    }
    if (!requirePassword()) return;

    setLoading(true);
    const { data, error } = isSignup
      ? await signUpWithPhone(phone, password)
      : await signInWithPhone(phone, password);
    setLoading(false);

    if (error) {
      setErrorKey(authErrorKey(error, IDENTIFIER_PHONE));
      return;
    }
    // A phone signup that still needs SMS confirmation returns no session.
    if (isSignup && !data?.session) {
      setOtpPhone(normalizePhone(phone));
      setOtpCode("");
      setOtpSent(true);
      return;
    }
    router.push(isSignup ? "/login" : "/");
  };

  const verifyOtp = async () => {
    clearStatus();
    if (otpCode.trim().length < OTP_CODE_LENGTH) {
      setErrorKey("authOtpInvalidCode");
      return;
    }
    setLoading(true);
    const { error } = await verifyPhoneOtp(otpPhone || phone, otpCode);
    setLoading(false);
    if (error) {
      setErrorKey(authErrorKey(error, IDENTIFIER_PHONE));
      return;
    }
    router.push("/");
  };

  const resendOtp = async () => {
    if (!isValidPhone(otpPhone || phone)) {
      setErrorKey("authInvalidPhone");
      return;
    }
    setErrorKey("");
    setResending(true);
    const { error } = await sendPhoneOtp(otpPhone || phone, { createUser: false });
    setResending(false);
    if (error) {
      setErrorKey(authErrorKey(error, IDENTIFIER_PHONE));
    }
  };

  return {
    identifier,
    changeIdentifier,
    isEmail,
    isPhone,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    usingOtp,
    changePhoneMethod,
    showOtp,
    showPassword,
    otpCode,
    setOtpCode,
    otpPhone,
    loading,
    resending,
    errorKey,
    noticeKey,
    submit,
    verifyOtp,
    resendOtp,
  };
}

export default useAuthForm;
