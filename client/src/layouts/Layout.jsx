import React from "react";
import { Link } from "react-router-dom";

export default function Layout(props) {
  const { currentUser, handleLogout } = props;

  return (
    <div className="main-container">
      <header>
        <Link to="/home">
          <img
            className="header-logo"
            src="https://i.imgur.com/1nzGA9M.png"
            alt="logo"
          />
        </Link>
        {currentUser ? (
          <>
            <div>
              <Link to="/home">Hello, {currentUser.username}!</Link>
              <br />
              <Link to="/recipes">Recipes</Link>
              <br />
              <Link onClick={handleLogout}>Logout</Link>
              <br />
            </div>
          </>
        ) : null}
      </header>
      {currentUser && <></>}
      {props.children}
      <footer>

      </footer>
    </div>
  );
}
