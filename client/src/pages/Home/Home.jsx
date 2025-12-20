import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="dpScreen dpHome">
      <div className="dpCard dpCardWide">
        <h1 className="dpH1">Welcome to Doberpop.</h1>

        <p className="dpSub">
          Your popcorn batch playbook — browse the catalog, then sign in to dial in and
          save your own.
        </p>

        <div className="dpDivider" />

        <div className="dpHomeGrid">
          {/* BROWSE */}
          <Link to="/recipes" className="dpHomeItem">
            <div className="dpKicker">Browse</div>
            <div className="dpHomeTitle">Explore signature batches</div>
            <div className="dpHomeText">
              Find flavor ideas, reference batches, yields, and kernel profiles.
            </div>
          </Link>

          {/* CREATE */}
          <Link to="/recipes/new" className="dpHomeItem">
            <div className="dpKicker">Create</div>
            <div className="dpHomeTitle">Build your own batches</div>
            <div className="dpHomeText">
              Create new batches, refine instructions, and iterate until everything
              tastes just right.
            </div>
          </Link>
        </div>

        <p className="dpHint dpHintTight">
          Use the top navigation to browse batches or start a new one.
        </p>
      </div>
    </div>
  );
}