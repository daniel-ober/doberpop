import { useMemo, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./ResetPassword.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const passwordRules = (pw) => {
  const s = pw || "";
  return {
    length: s.length >= 8,
    lower: /[a-z]/.test(s),
    upper: /[A-Z]/.test(s),
    number: /[0-9]/.test(s),
    special: /[^A-Za-z0-9]/.test(s),
  };
};

export default function ResetPassword() {
  const query = useQuery();
  const history = useHistory();

  const oobCode = query.get("oobCode") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const pw = useMemo(() => passwordRules(password), [password]);

  if (!oobCode) {
    return (
      <div className="rp-wrapper">
        <div className="rp-card">
          <h1 className="rp-title">Invalid or expired link</h1>
          <p className="rp-subtitle">
            This reset link is missing or expired. Try requesting another one.
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
      await confirmPasswordReset(auth, oobCode, password);

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

          <div className="rp-password-hint">
            Your new password must include:
          </div>

          <div className="rp-password-checklist">
            <div className={`rp-password-item ${pw.length ? "is-ok" : ""}`}>
              {pw.length ? "✓" : "•"} At least 8 characters
            </div>
            <div className={`rp-password-item ${pw.lower ? "is-ok" : ""}`}>
              {pw.lower ? "✓" : "•"} One lowercase letter
            </div>
            <div className={`rp-password-item ${pw.upper ? "is-ok" : ""}`}>
              {pw.upper ? "✓" : "•"} One uppercase letter
            </div>
            <div className={`rp-password-item ${pw.number ? "is-ok" : ""}`}>
              {pw.number ? "✓" : "•"} One number
            </div>
            <div className={`rp-password-item ${pw.special ? "is-ok" : ""}`}>
              {pw.special ? "✓" : "•"} One special character
            </div>
          </div>

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