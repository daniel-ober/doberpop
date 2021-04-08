import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {

  return (
    <div className='landing-container'>
      <img
        className="login-logo"
        src="https://i.imgur.com/1nzGA9M.png"
        alt="logo"
      />
      <br />
      <Link to="/login">Sign In </Link>or<Link to="/register"> Register</Link>
    </div>
  );
}
