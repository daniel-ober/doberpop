import { useState } from "react";
import "./ForgotPassword.css";

const API_BASE = process.env.REACT_APP_API_URL || "";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) throw new Error(data.error || "Unable to send reset email");

      setMessage(
        "If an account exists for that email, you'll receive a reset link shortly."
      );
    } catch (err) {
      console.error(err);
      setMessage(
        "If an account exists for that email, you'll receive a reset link shortly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <h1 className="fp-title">Forgot your password?</h1>
        <p className="fp-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="fp-form">
          <label className="fp-label">
            Email
            <input
              type="email"
              className="fp-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          {error && <div className="fp-error">{error}</div>}
          {message && <div className="fp-success">{message}</div>}

          <button
            className="fp-button"
            disabled={submitting || !email.trim()}
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}