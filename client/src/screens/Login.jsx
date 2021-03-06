import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login(props) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isError: false,
    errorMsg:
      "Invalid Credentials: Your Username or Password is incorrect. Try Again",
  });

  const { username, password } = formData;
  const { handleLogin } = props;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form
    className='login-form'
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin(formData);
      }}
    >
      <img
        className="login-logo"
        src="https://i.imgur.com/1nzGA9M.png"
        alt="logo"
      />
      <br />
      <label>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={username}
          onChange={handleChange}
          className="login-field"
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={handleChange}
          className="login-field"
        />
      </label>
      <br />
      <button className="login-button">Login</button>
      <br />
      Dont have an account?
      <br />
      <Link to="/register" className="register-link">
        Register
      </Link>
      <br />
    </form>
  );
}
