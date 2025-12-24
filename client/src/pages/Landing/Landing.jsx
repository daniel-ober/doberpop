// client/src/pages/Landing/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

import logo from "../../assets/images/logo.png";

export default function Landing() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="landing">
      <div className="landing__wrap">
        <section className="landing__card" aria-label="Doberpop landing">
          <div className="landing__top">
            <img className="landing__logo" src={logo} alt="Doberpop" />

            <div className="landing__kicker">Your personal popcorn workshop</div>

            <h1 className="landing__title">
              Build, refine, and manage your popcorn batches.
            </h1>

            <p className="landing__subtitle">
              Browse flavors, then sign in to create your own batches, dial in your
              process, and keep everything organized in one place.
            </p>
          </div>

          <div
            className="landing__actions"
            role="group"
            aria-label="Primary actions"
          >
            <Link className="landing__btn landing__btn--primary" to="/recipes">
              Browse Batches
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
              Tip: Sign in to create new batches, update them anytime, and build
              your personal Doberpop playbook.
            </p>

            <div className="landing__chips">
              <span className="landing__chip">Batch management</span>
              <span className="landing__chip">Kernel profiles</span>
              <span className="landing__chip">Precise ingredients</span>
              <span className="landing__chip">Step-by-step process</span>
            </div>
          </div>

          {/* Legal footer */}
          <div className="landing__legal">
            <span>© {currentYear} Doberpop</span>
            <span className="landing__legalDot">•</span>
            <Link to="/privacy" className="landing__legalLink">
              Privacy Policy
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}