import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing__card">
        <img
          className="landing__logo"
          src="https://i.imgur.com/1nzGA9M.png"
          alt="Doberpop"
        />

        <h1 className="landing__title">Doberpop</h1>
        <p className="landing__subtitle">
          A recipe book for popcorn people. Browse, save, and build your own.
        </p>

        <div className="landing__actions">
          <Link className="btn btn--primary" to="/recipes">
            Browse Recipes
          </Link>
          <Link className="btn btn--ghost" to="/login">
            Sign In
          </Link>
          <Link className="btn btn--ghost" to="/register">
            Register
          </Link>
        </div>

        <p className="landing__meta">
          Tip: Sign in to create and manage your own recipes.
        </p>
      </div>
    </div>
  );
}