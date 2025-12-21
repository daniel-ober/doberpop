import { useEffect, useMemo, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./AccountSettings.css";
import { updateAccount } from "../../services/auth";

// Password rules (same as Register)
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

export default function AccountSettings({ currentUser, onAccountUpdated }) {
  const history = useHistory();

  const [initialUsername, setInitialUsername] = useState(
    currentUser?.username || ""
  );
  const [initialEmail, setInitialEmail] = useState(currentUser?.email || "");

  const [form, setForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Username confirmation modal state
  const [showUsernameConfirm, setShowUsernameConfirm] = useState(false);
  const [usernameConfirmed, setUsernameConfirmed] = useState(false);

  // Keep form username/email in sync with currentUser
  useEffect(() => {
    const nextUsername = currentUser?.username || "";
    const nextEmail = currentUser?.email || "";

    setInitialUsername(nextUsername);
    setInitialEmail(nextEmail);

    setForm((prev) => ({
      ...prev,
      username: nextUsername,
      email: nextEmail,
    }));
  }, [currentUser]);

  const { username, email, currentPassword, newPassword, confirmPassword } =
    form;

  const pw = useMemo(() => passwordRules(newPassword), [newPassword]);

  const usernameError = useMemo(() => {
    const u = (username || "").trim();
    if (!u) return "Username is required.";
    if (u.length < 3) return "Username must be at least 3 characters.";
    if (u.length > 20) return "Username must be 20 characters or less.";
    if (!/^[a-zA-Z0-9_]+$/.test(u)) {
      return "Username can only use letters, numbers, and underscores.";
    }
    return "";
  }, [username]);

  const emailError = useMemo(() => {
    const e = (email || "").trim();
    if (!e) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return "Please enter a valid email address.";
    }
    return "";
  }, [email]);

  const newPasswordError = useMemo(() => {
    if (!newPassword) return "";
    const ok = Object.values(pw).every(Boolean);
    return ok ? "" : "New password does not meet all requirements.";
  }, [newPassword, pw]);

  const confirmPasswordError = useMemo(() => {
    if (!newPassword) return "";
    if (!confirmPassword) return "Please confirm your new password.";
    if (newPassword !== confirmPassword) return "Passwords do not match.";
    return "";
  }, [newPassword, confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const performSubmit = useCallback(async () => {
    setTouched({
      username: true,
      email: true,
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (usernameError || emailError) return;

    const wantsPasswordChange = Boolean(newPassword || confirmPassword);

    if (wantsPasswordChange) {
      if (!currentPassword) {
        setError("Please enter your current password to change it.");
        return;
      }
      if (newPasswordError || confirmPasswordError) return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
      };

      if (wantsPasswordChange) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const result = await updateAccount(payload); // calls /auth/account
      const updatedUser = result?.user;

      if (updatedUser && typeof onAccountUpdated === "function") {
        onAccountUpdated(updatedUser);
      }

      setSuccess("Your account settings have been updated.");

      // Reset "initial" values to reflect the latest username/email
      setInitialUsername(updatedUser?.username || username.trim());
      setInitialEmail(updatedUser?.email || email.trim());

      // Clear password fields + confirmation
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setTouched((prev) => ({
        ...prev,
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      }));

      setUsernameConfirmed(false);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Unable to update account. Please try again.";

      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [
    username,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    usernameError,
    emailError,
    newPasswordError,
    confirmPasswordError,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameChanged =
      username.trim() !== (initialUsername || "").trim();

    // If the username has changed and we haven't confirmed yet, show modal
    if (usernameChanged && !usernameConfirmed) {
      setShowUsernameConfirm(true);
      return;
    }

    // Either username didn't change, or user already confirmed
    await performSubmit();
  };

  const handleCancel = () => {
    history.goBack();
  };

  const confirmUsernameChange = async () => {
    setShowUsernameConfirm(false);
    setUsernameConfirmed(true);
    await performSubmit();
    // after submit, we reset usernameConfirmed in performSubmit
  };

  const showUsernameError = touched.username && usernameError;
  const showEmailError = touched.email && emailError;
  const showNewPasswordError = touched.newPassword && newPasswordError;
  const showConfirmPasswordError =
    touched.confirmPassword && confirmPasswordError;

  return (
    <div className="accountSettings">
      <div className="accountSettings__card">
        <h1 className="accountSettings__title">Account Settings</h1>
        <p className="accountSettings__subtitle">
          Update your username, email, and password. Changes apply next time you
          sign in.
        </p>

        {error && (
          <div className="accountSettings__alert accountSettings__alert--error">
            {error}
          </div>
        )}
        {success && (
          <div className="accountSettings__alert accountSettings__alert--success">
            {success}
          </div>
        )}

        <form
          className="accountSettings__form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Profile */}
          <section className="accountSettings__section">
            <h2 className="accountSettings__sectionTitle">Profile</h2>

            <label className="accountSettings__label">
              <span className="accountSettings__labelText">Username</span>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="username"
                className={`accountSettings__input ${
                  showUsernameError ? "accountSettings__input--error" : ""
                }`}
                autoComplete="username"
                spellCheck={false}
              />
              {showUsernameError && (
                <div className="accountSettings__errorText">
                  {usernameError}
                </div>
              )}
            </label>

            <label className="accountSettings__label">
              <span className="accountSettings__labelText">Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={`accountSettings__input ${
                  showEmailError ? "accountSettings__input--error" : ""
                }`}
                autoComplete="email"
              />
              {showEmailError && (
                <div className="accountSettings__errorText">{emailError}</div>
              )}
            </label>
          </section>

          {/* Password */}
          <section className="accountSettings__section accountSettings__section--password">
            <h2 className="accountSettings__sectionTitle">Password</h2>

            <label className="accountSettings__label">
              <span className="accountSettings__labelText">
                Current password
              </span>
              <input
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="required if changing password"
                className="accountSettings__input"
                autoComplete="current-password"
              />
            </label>

            <div className="accountSettings__pwRow">
              <label className="accountSettings__label">
                <span className="accountSettings__labelText">New password</span>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="leave blank to keep current"
                  className={`accountSettings__input ${
                    showNewPasswordError ? "accountSettings__input--error" : ""
                  }`}
                  autoComplete="new-password"
                />
                {showNewPasswordError && (
                  <div className="accountSettings__errorText">
                    {newPasswordError}
                  </div>
                )}
              </label>

              <label className="accountSettings__label">
                <span className="accountSettings__labelText">
                  Confirm new password
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="re-type new password"
                  className={`accountSettings__input ${
                    showConfirmPasswordError
                      ? "accountSettings__input--error"
                      : ""
                  }`}
                  autoComplete="new-password"
                />
                {showConfirmPasswordError && (
                  <div className="accountSettings__errorText">
                    {confirmPasswordError}
                  </div>
                )}
              </label>
            </div>

            <div className="accountSettings__pwHint">
              Leave the new password fields blank if you only want to update
              your username or email.
            </div>

            <div
              className="accountSettings__pwChecklist"
              aria-label="Password requirements"
            >
              <div
                className={`accountSettings__pwItem ${
                  pw.length ? "is-ok" : ""
                }`}
              >
                <span className="accountSettings__pwIcon">
                  {pw.length ? "✓" : "•"}
                </span>
                At least 8 characters
              </div>
              <div
                className={`accountSettings__pwItem ${
                  pw.lower ? "is-ok" : ""
                }`}
              >
                <span className="accountSettings__pwIcon">
                  {pw.lower ? "✓" : "•"}
                </span>
                One lowercase letter
              </div>
              <div
                className={`accountSettings__pwItem ${
                  pw.upper ? "is-ok" : ""
                }`}
              >
                <span className="accountSettings__pwIcon">
                  {pw.upper ? "✓" : "•"}
                </span>
                One uppercase letter
              </div>
              <div
                className={`accountSettings__pwItem ${
                  pw.number ? "is-ok" : ""
                }`}
              >
                <span className="accountSettings__pwIcon">
                  {pw.number ? "✓" : "•"}
                </span>
                One number
              </div>
              <div
                className={`accountSettings__pwItem ${
                  pw.special ? "is-ok" : ""
                }`}
              >
                <span className="accountSettings__pwIcon">
                  {pw.special ? "✓" : "•"}
                </span>
                One special character
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="accountSettings__actions">
            <button
              type="button"
              className="accountSettings__btn accountSettings__btn--ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="accountSettings__btn accountSettings__btn--primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Username change confirmation modal */}
      {showUsernameConfirm && (
        <div className="accountSettings__confirmOverlay">
          <div className="accountSettings__confirmDialog">
            <h2 className="accountSettings__confirmTitle">
              Change username?
            </h2>
            <p className="accountSettings__confirmText">
              You&apos;re about to change your username from{" "}
              <strong>{initialUsername || "(none)"}</strong> to{" "}
              <strong>{username.trim() || "(blank)"}</strong>.
            </p>
            <p className="accountSettings__confirmText accountSettings__confirmText--warning">
              For security and consistency, usernames can only be updated once
              every <strong>90 days</strong>. You won&apos;t be able to change
              it again until that window has passed.
            </p>

            <div className="accountSettings__confirmActions">
              <button
                type="button"
                className="accountSettings__confirmBtn accountSettings__confirmBtn--ghost"
                onClick={() => setShowUsernameConfirm(false)}
              >
                Go back
              </button>
              <button
                type="button"
                className="accountSettings__confirmBtn accountSettings__confirmBtn--primary"
                onClick={confirmUsernameChange}
                disabled={saving}
              >
                {saving ? "Saving…" : "Yes, change username"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}