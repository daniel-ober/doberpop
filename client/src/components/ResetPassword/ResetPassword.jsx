// client/src/components/ResetPassword/ResetPassword.jsx
import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./ResetPassword.css";

const API_BASE = process.env.REACT_APP_API_URL || "";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const history = useHistory();

  const token = query.get("token") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!token) {
    return (
      <div className="rp-wrapper">
        <div className="rp-card">
          <h1 className="rp-title">Invalid or expired link</h1>
          <p className="rp-subtitle">
            This reset link is missing or expired. Try requesting another one
            from the forgot password page.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) throw new Error(data.error || "Unable to reset password");

      setMessage("Your password was updated successfully.");
      setTimeout(() => {
        history.push("/login");
      }, 1600);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to reset password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rp-wrapper">
      <div className="rp-card">
        <h1 className="rp-title">Set a new password</h1>
        <p className="rp-subtitle">Enter your new password below.</p>

        <form className="rp-form" onSubmit={handleSubmit}>
          <label className="rp-label">
            New Password
            <input
              type="password"
              className="rp-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          <label className="rp-label">
            Confirm New Password
            <input
              type="password"
              className="rp-input"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={8}
            />
          </label>

          {error && <div className="rp-error">{error}</div>}
          {message && <div className="rp-success">{message}</div>}

          <button className="rp-button" disabled={submitting}>
            {submitting ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}