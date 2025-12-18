// client/src/pages/Home/Home.jsx
import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="dpScreen dpHome">
      <div className="dpCard dpCardWide">
        <h1 className="dpH1">Welcome to Doberpop.</h1>
        <p className="dpSub">
          Your popcorn recipe book — browse the catalog, then sign in to save and
          build your own.
        </p>

        <div className="dpDivider" />

        <div className="dpHomeGrid">
          <div className="dpHomeItem">
            <div className="dpKicker">Browse</div>
            <div className="dpHomeTitle">Explore recipes</div>
            <div className="dpHomeText">
              Find flavor ideas, ingredients, yields, and kernel profiles.
            </div>
          </div>

          <div className="dpHomeItem">
            <div className="dpKicker">Create</div>
            <div className="dpHomeTitle">Build your own</div>
            <div className="dpHomeText">
              Sign in to create recipes, refine instructions, and iterate.
            </div>
          </div>

          <div className="dpHomeItem">
            <div className="dpKicker">Organize</div>
            <div className="dpHomeTitle">Keep it clean</div>
            <div className="dpHomeText">
              A simple workflow — fast search, sorting, and editing.
            </div>
          </div>
        </div>

        <p className="dpHint dpHintTight">
          Tip: Use the top navigation to browse recipes, sign in, or register.
        </p>
      </div>
    </div>
  );
}