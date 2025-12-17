import React from "react";

export default function UserHome(props) {
  const { currentUser } = props;

  return (
    <div>
      {currentUser && (
        <>
          <div className="welcome-message">
            <div className="welcome-title">Hello, {currentUser.username}!</div>
            <br/>
            <br/>
            <div className="welcome-body">
              Click the Recipes link in the top right corner to search for some
              popcorn recipes.
              <br/>
              <br/>
              Or contribute to the doberpop Community and click the '+' button at the bottom of the Recipes screen to add your favorite recipe!
            </div>
          </div>
        </>
      )}
      {props.children}
    </div>
  );
}
