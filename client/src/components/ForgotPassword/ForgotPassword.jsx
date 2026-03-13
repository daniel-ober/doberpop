import { Link } from "react-router-dom";
import { useState } from "react";
import "../../styles/auth.css";
import "./ForgotPassword.css";

import logo from "../../assets/images/logo-reduced.png";

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
    <div className="auth auth--forgot">
      <div className="auth__card fpCard">
        <div className="auth__top fpTop">
          <img className="auth__logo fpLogo" src={logo} alt="Doberpop" />
          <h1 className="auth__title fpTitle">Forgot your password?</h1>
          <p className="auth__subtitle fpSubtitle">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {error ? (
          <div className="auth__alert" role="alert">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="auth__alert auth__alert--success" role="status">
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="auth__form fpForm">
          <label className="auth__label fpLabel">
            <span className="auth__labelText">Email</span>
            <input
              type="email"
              className="auth__input fpInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <div className="auth__actions fpActions">
            <button
              className="auth__btn auth__btn--primary fpButton"
              disabled={submitting || !email.trim()}
              type="submit"
            >
              {submitting ? "Sending..." : "Send reset link"}
            </button>
          </div>

          <div className="auth__fineprint fpFineprint">
            Remembered it?{" "}
            <Link to="/login" className="auth__link">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}