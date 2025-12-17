import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

import logo from "../../assets/images/logo.png";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing__wrap">
        <section className="landing__card" aria-label="Doberpop landing">
          <div className="landing__top">
            <img className="landing__logo" src={logo} alt="Doberpop" />
            <div className="landing__kicker">A recipe book for popcorn people</div>

            <h1 className="landing__title">Build, save, and share recipes.</h1>

            <p className="landing__subtitle">
              Browse the catalog, then sign in to create and manage your own flavor lineup.
            </p>
          </div>

          <div className="landing__actions" role="group" aria-label="Primary actions">
            <Link className="landing__btn landing__btn--primary" to="/recipes">
              Browse Recipes
            </Link>
            <Link className="landing__btn landing__btn--ghost" to="/login">
              Sign In
            </Link>
            <Link className="landing__btn landing__btn--ghost" to="/register">
              Register
            </Link>
          </div>

          <div className="landing__divider" />

          <div className="landing__bottom">
            <p className="landing__tip">
              Tip: Sign in to create recipes, edit them anytime, and keep your personal cookbook organized.
            </p>

            <div className="landing__chips">
              <span className="landing__chip">Kernel profiles</span>
              <span className="landing__chip">Ingredients</span>
              <span className="landing__chip">Instructions</span>
              <span className="landing__chip">Community driven</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}