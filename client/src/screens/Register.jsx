import { useState } from "react";
import { Link } from "react-router-dom";

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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="register-container">
      <form
        className='register-form'
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister(formData);
        }}
      >
        <img
          className="login-logo"
          src="https://i.imgur.com/1nzGA9M.png"
          alt="logo"
        />
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={handleChange}
          className="register-field"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          value={email}
          onChange={handleChange}
          className="register-field"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={handleChange}
          className="register-field"
        />
        <button className="register-button">Create Account</button>
        Already have an account?
        <br />
        <Link to="/login">Sign In</Link>
      </form>
    </div>
  );
}
