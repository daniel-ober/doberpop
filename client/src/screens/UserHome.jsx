import React from "react";

export default function UserHome(props) {
  const { currentUser } = props;

  return (
    <div>
      {currentUser && (
        <>
          <div className="welcome-message">
            <div className="welcome-title">Hello, {currentUser.username}!</div>
            <div className="welcome-body">
              Click the Recipes link in the top right corner to search for some
              popcorn recipes. Click the '+' button at the bottom of the screen
              to add your favorite recipe!
            </div>
          </div>
        </>
      )}
      {props.children}
    </div>
  );
}
