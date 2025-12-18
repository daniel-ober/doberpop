import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "./Register.css";

import logo from "../../assets/images/logo.png";

/**
 * Validation helpers
 */
const USERNAME_MIN = 3;
const USERNAME_MAX = 20;

// letters, numbers, underscores only
const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

// lightweight email check (good enough for UI gating)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
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

function extractRailsErrors(err) {
  // Normalizes common Rails API shapes into:
  // { fieldErrors: { username: "…", email: "…", password: "…" }, general: "…" }
  const out = { fieldErrors: {}, general: "" };

  const status = err?.response?.status;
  const data = err?.response?.data;

  if (!data) {
    if (status === 422) {
      out.general = "Unable to create account. Please check your details and try again.";
    } else {
      out.general = "Something went wrong. Please try again.";
    }
    return out;
  }

  // If Rails returns plain string
  if (typeof data === "string") {
    out.general = data;
    return out;
  }

  // ✅ IMPORTANT: many Rails APIs return direct field errors like:
  // { username: ["has already been taken"], email: ["is invalid"] }
  // (not nested under `errors`)
  const looksLikeDirectFieldErrors =
    typeof data === "object" &&
    !Array.isArray(data) &&
    !data.errors &&
    (data.username || data.email || data.password);

  if (looksLikeDirectFieldErrors) {
    for (const [key, val] of Object.entries(data)) {
      if (Array.isArray(val) && val.length) out.fieldErrors[key] = val[0];
      else if (typeof val === "string") out.fieldErrors[key] = val;
    }
    if (status === 422 && Object.keys(out.fieldErrors).length) return out;
  }

  // Nested errors shape:
  // { errors: { username: ["..."] } }
  if (data.errors && typeof data.errors === "object") {
    for (const [key, val] of Object.entries(data.errors)) {
      if (Array.isArray(val) && val.length) out.fieldErrors[key] = val[0];
      else if (typeof val === "string") out.fieldErrors[key] = val;
    }
  }

  // General message
  out.general =
    data.message ||
    (typeof data.error === "string" ? data.error : "") ||
    out.general;

  if (!out.general && status === 422 && Object.keys(out.fieldErrors).length === 0) {
    out.general = "Unable to create account. Please check your details and try again.";
  }

  return out;
}

export default function Register(props) {
  const { handleRegister } = props;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { username, email, password } = formData;

  const pw = useMemo(() => passwordRules(password), [password]);

  const usernameClientError = useMemo(() => {
    const u = username.trim();
    if (!u) return "Username is required.";
    if (u.length < USERNAME_MIN) return `Username must be at least ${USERNAME_MIN} characters.`;
    if (u.length > USERNAME_MAX) return `Username must be ${USERNAME_MAX} characters or less.`;
    if (!USERNAME_RE.test(u)) return "Username can only use letters, numbers, and underscores.";
    return "";
  }, [username]);

  const emailClientError = useMemo(() => {
    const e = email.trim();
    if (!e) return "Email is required.";
    if (!EMAIL_RE.test(e)) return "Please enter a valid email address.";
    return "";
  }, [email]);

  const passwordClientError = useMemo(() => {
    if (!password) return "Password is required.";
    const ok = Object.values(pw).every(Boolean);
    if (!ok) return "Password does not meet all requirements.";
    return "";
  }, [password, pw]);

  const allValid = useMemo(() => {
    return !usernameClientError && !emailClientError && !passwordClientError;
  }, [usernameClientError, emailClientError, passwordClientError]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear server errors as user edits
    setGeneralError("");
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Mark all touched so errors show if user tries to submit early
    setTouched({ username: true, email: true, password: true });

    // Client gate
    if (!allValid || isSubmitting) return;

    setIsSubmitting(true);
    setGeneralError("");
    setFieldErrors({});

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password,
      };

      // ✅ Preferred: use your existing handleRegister if provided
      if (typeof handleRegister === "function") {
        const result = handleRegister(payload);
        if (result?.then) await result;
      } else {
        // ✅ Fallback if handleRegister isn't wired
        throw new Error("handleRegister is not provided. Wire it up in App/router.");
      }
    } catch (err) {
      const extracted = extractRailsErrors(err);

      const nextFieldErrors = { ...extracted.fieldErrors };

      // Friendlier messages
      if (nextFieldErrors.username?.toLowerCase().includes("taken")) {
        nextFieldErrors.username = "That username is already taken. Try a different one.";
      }
      if (nextFieldErrors.email?.toLowerCase().includes("taken")) {
        nextFieldErrors.email = "That email is already registered. Try signing in instead.";
      }
      if (nextFieldErrors.email?.toLowerCase().includes("invalid")) {
        nextFieldErrors.email = "Please enter a valid email address.";
      }

      setFieldErrors(nextFieldErrors);

      const hasField = Object.keys(nextFieldErrors).length > 0;
      setGeneralError(
        hasField ? "" : extracted.general || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showUsernameError = touched.username && usernameClientError;
  const showEmailError = touched.email && emailClientError;
  const showPasswordError = touched.password && passwordClientError;

  const usernameErrorToShow = fieldErrors.username || showUsernameError;
  const emailErrorToShow = fieldErrors.email || showEmailError;
  const passwordErrorToShow = fieldErrors.password || showPasswordError;

  return (
    <div className="auth auth--register">
      <div className="auth__card">
        <div className="auth__top">
          <img className="auth__logo" src={logo} alt="Doberpop" />
          <h1 className="auth__title">Create account</h1>
          <p className="auth__subtitle">Save your recipes and build your own cookbook.</p>
        </div>

        {generalError ? (
          <div className="auth__alert" role="alert">
            {generalError}
          </div>
        ) : null}

        <form className="auth__form" onSubmit={submit} noValidate>
          <label className="auth__label">
            <span className="auth__labelText">Username</span>
            <input
              type="text"
              name="username"
              placeholder="choose a username"
              value={username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth__input ${usernameErrorToShow ? "auth__input--error" : ""}`}
              autoComplete="username"
              spellCheck={false}
              inputMode="text"
            />
            {usernameErrorToShow ? (
              <div className="auth__errorText">{usernameErrorToShow}</div>
            ) : null}
          </label>

          <label className="auth__label">
            <span className="auth__labelText">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth__input ${emailErrorToShow ? "auth__input--error" : ""}`}
              autoComplete="email"
            />
            {emailErrorToShow ? (
              <div className="auth__errorText">{emailErrorToShow}</div>
            ) : null}
          </label>

          <label className="auth__label">
            <span className="auth__labelText">Password</span>
            <input
              type="password"
              name="password"
              placeholder="create a password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth__input ${passwordErrorToShow ? "auth__input--error" : ""}`}
              autoComplete="new-password"
            />
            {passwordErrorToShow ? (
              <div className="auth__errorText">{passwordErrorToShow}</div>
            ) : null}
          </label>

          <div className="auth__pwChecklist" aria-label="Password requirements">
            <div className={`auth__pwItem ${pw.length ? "is-ok" : ""}`}>
              <span className="auth__pwIcon">{pw.length ? "✓" : "•"}</span>
              At least 8 characters
            </div>
            <div className={`auth__pwItem ${pw.lower ? "is-ok" : ""}`}>
              <span className="auth__pwIcon">{pw.lower ? "✓" : "•"}</span>
              One lowercase letter
            </div>
            <div className={`auth__pwItem ${pw.upper ? "is-ok" : ""}`}>
              <span className="auth__pwIcon">{pw.upper ? "✓" : "•"}</span>
              One uppercase letter
            </div>
            <div className={`auth__pwItem ${pw.number ? "is-ok" : ""}`}>
              <span className="auth__pwIcon">{pw.number ? "✓" : "•"}</span>
              One number
            </div>
            <div className={`auth__pwItem ${pw.special ? "is-ok" : ""}`}>
              <span className="auth__pwIcon">{pw.special ? "✓" : "•"}</span>
              One special character
            </div>
          </div>

          <div className="auth__actions">
            <button
              className="auth__btn auth__btn--primary"
              type="submit"
              disabled={!allValid || isSubmitting}
              aria-disabled={!allValid || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create account"}
            </button>
          </div>

          <div className="auth__fineprint">
            Already have an account?{" "}
            <Link to="/login" className="auth__link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}