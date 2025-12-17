import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "./Login.css";

import logo from "../../assets/images/logo.png";

export default function Login(props) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isError: false,
    errorMsg: "Invalid Credentials: Your Username or Password is incorrect. Try Again",
  });

  const { username, password, isError, errorMsg } = formData;
  const { handleLogin } = props;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, isError: false }));
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__top">
          <img className="auth__logo login-logo" src={logo} alt="Doberpop" />
          <h1 className="auth__title">Sign in</h1>
          <p className="auth__subtitle">Welcome back — let’s get you into your cookbook.</p>
        </div>

        <form
          className="auth__form login-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(formData);
          }}
        >
          <label className="auth__label">
            <span className="auth__labelText">Username</span>
            <input
              type="text"
              name="username"
              placeholder="your username"
              value={username}
              onChange={handleChange}
              className="auth__input login-field"
              autoComplete="username"
            />
          </label>

          <label className="auth__label">
            <span className="auth__labelText">Password</span>
            <input
              type="password"
              name="password"
              placeholder="your password"
              value={password}
              onChange={handleChange}
              className="auth__input login-field"
              autoComplete="current-password"
            />
          </label>

          <div className="auth__actions">
            <button className="auth__btn auth__btn--primary login-button">Sign in</button>
          </div>

          {isError ? <div className="auth__error">{errorMsg}</div> : null}

          <div className="auth__fineprint">
            Don’t have an account?{" "}
            <Link to="/register" className="auth__link register-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}