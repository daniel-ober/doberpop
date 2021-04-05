import React from "react";

export default function UserHome(props) {
  const { currentUser } = props;

  return (
    <div>
      {currentUser && (
        <>
          <h3>Hello, {currentUser.username}!</h3>
          <br />
          <p>
            Click the yellow avatar icon in the top right corner to navigate
            around the site
          </p>
        </>
      )}
      {props.children}
    </div>
  );
}
