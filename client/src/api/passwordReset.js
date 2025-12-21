// client/src/api/passwordReset.js

const API_BASE = process.env.REACT_APP_API_URL || "";

/**
 * POST /auth/password/forgot
 * Payload: { email }
 */
export async function requestPasswordReset(email) {
  const res = await fetch(`${API_BASE}/auth/password/forgot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  // Backend will usually return 200 even if user not found,
  // but we still guard against unexpected failures.
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // ignore parse errors – just use a generic message
  }

  if (!res.ok) {
    throw new Error(data.error || "Unable to send password reset email.");
  }

  return data; // { message: "If your email exists, you'll receive a reset link shortly." }
}

/**
 * POST /auth/password/reset
 * Payload: { token, password, password_confirmation }
 */
export async function resetPassword({ token, password, passwordConfirmation }) {
  const res = await fetch(`${API_BASE}/auth/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    throw new Error(data.error || "Unable to reset password.");
  }

  return data; // { message: "Password updated successfully." }
}