// client/src/api/passwordReset.js

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

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

  let data = {};
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    throw new Error(data.error || "Unable to send password reset email.");
  }

  return data;
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

  return data;
}