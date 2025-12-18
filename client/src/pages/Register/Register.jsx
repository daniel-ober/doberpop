import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "./Register.css";

import logo from "../../assets/images/logo.png";

export default function Register(props) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;
  const { handleRegister } = props;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth auth--register">
      <div className="auth__card">
        <div className="auth__top">
          <img className="auth__logo login-logo" src={logo} alt="Doberpop" />
          <h1 className="auth__title">Create account</h1>
          <p className="auth__subtitle">Save your recipes and build your own cookbook.</p>
        </div>

        <form
          className="auth__form register-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister(formData);
          }}
        >
          <label className="auth__label">
            <span className="auth__labelText">Username</span>
            <input
              type="text"
              name="username"
              placeholder="choose a username"
              value={username}
              onChange={handleChange}
              className="auth__input register-field"
              autoComplete="username"
            />
          </label>

          <label className="auth__label">
            <span className="auth__labelText">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              className="auth__input register-field"
              autoComplete="email"
            />
          </label>

          <label className="auth__label">
            <span className="auth__labelText">Password</span>
            <input
              type="password"
              name="password"
              placeholder="create a password"
              value={password}
              onChange={handleChange}
              className="auth__input register-field"
              autoComplete="new-password"
            />
          </label>

          <div className="auth__actions">
            <button className="auth__btn auth__btn--primary register-button">
              Create account
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