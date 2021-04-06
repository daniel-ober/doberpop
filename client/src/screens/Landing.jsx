import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {

  return (
    <div>
      <img
        className="landing-logo"
        src="https://i.imgur.com/518XICb.png"
        alt="logo"
      />
      <br />
      <Link to="/login">Sign In </Link>or<Link to="/register"> Register</Link>
    </div>
  );
}
