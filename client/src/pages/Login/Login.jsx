// client/src/pages/Login/Login.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "./Login.css";

import logo from "../../assets/images/logo.png";

// lightweight email check (for labeling UX only — NOT security)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function extractAuthError(err) {
  // Keep error generic on purpose (avoid account enumeration)
  const status = err?.response?.status;
  if (status === 401) return "Invalid username/email or password.";
  if (status === 422) return "Unable to sign in. Please check your details and try again.";
  return "Something went wrong. Please try again.";
}

export default function Login(props) {
  const { handleLogin } = props;

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const { identifier, password } = formData;

  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });

  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const identifierClientError = useMemo(() => {
    const v = identifier.trim();
    if (!v) return "Username or email is required.";
    return "";
  }, [identifier]);

  const passwordClientError = useMemo(() => {
    if (!password) return "Password is required.";
    return "";
  }, [password]);

  const allValid = useMemo(() => {
    return !identifierClientError && !passwordClientError;
  }, [identifierClientError, passwordClientError]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // clear errors as user types
    setGeneralError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setTouched({ identifier: true, password: true });

    if (!allValid || isSubmitting) return;

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const payload = {
        identifier: identifier.trim(),
        password,
      };

      const result = handleLogin(payload);
      if (result?.then) await result;
    } catch (err) {
      setGeneralError(extractAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showIdentifierError = touched.identifier && identifierClientError;
  const showPasswordError = touched.password && passwordClientError;

  const identifierLabel = useMemo(() => {
    const v = identifier.trim();
    if (!v) return "Username or email";
    return EMAIL_RE.test(v) ? "Email" : "Username";
  }, [identifier]);

  return (
    <div className="auth auth--login">
      <div className="auth__card">
        <div className="auth__top">
          <img className="auth__logo" src={logo} alt="Doberpop" />
          <h1 className="auth__title">Sign in</h1>
          <p className="auth__subtitle">Welcome back — let’s get you into your cookbook.</p>
        </div>

        {generalError ? (
          <div className="auth__alert" role="alert">
            {generalError}
          </div>
        ) : null}

        <form className="auth__form" onSubmit={submit}>
          <label className="auth__label">
            <span className="auth__labelText">{identifierLabel}</span>
            <input
              type="text"
              name="identifier"
              placeholder="username or email"
              value={identifier}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth__input ${showIdentifierError ? "auth__input--error" : ""}`}
              autoComplete="username"
              spellCheck={false}
              inputMode="text"
            />
            {showIdentifierError ? (
              <div className="auth__errorText">{identifierClientError}</div>
            ) : null}
          </label>

          <label className="auth__label">
            <span className="auth__labelText">Password</span>
            <input
              type="password"
              name="password"
              placeholder="your password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`auth__input ${showPasswordError ? "auth__input--error" : ""}`}
              autoComplete="current-password"
            />
            {showPasswordError ? (
              <div className="auth__errorText">{passwordClientError}</div>
            ) : null}
          </label>

          <div className="auth__actions">
            <button
              className="auth__btn auth__btn--primary"
              type="submit"
              disabled={!allValid || isSubmitting}
              aria-disabled={!allValid || isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="auth__fineprint">
            Don’t have an account?{" "}
            <Link to="/register" className="auth__link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}