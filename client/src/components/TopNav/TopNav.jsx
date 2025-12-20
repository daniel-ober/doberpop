// client/src/components/TopNav/TopNav.js
import { NavLink, Link } from "react-router-dom";
import "./TopNav.css";
import logo from "../../assets/images/logo-reduced.png";

function isAdminUser(user) {
  return Boolean(
    user?.is_admin ||
      user?.isAdmin ||
      user?.admin ||
      user?.role === "admin" ||
      user?.userType === "admin"
  );
}

export default function TopNav({ currentUser, handleLogout }) {
  const admin = isAdminUser(currentUser);
  const logoTarget = currentUser ? "/home" : "/";

  return (
    <header className="topnav" role="banner">
      <div className="topnav__inner">
        {/* Brand / logo */}
        <Link
          to={logoTarget}
          className="topnav__brand"
          aria-label="Go to Doberpop home"
        >
          <img className="topnav__logo" src={logo} alt="Doberpop" />
        </Link>

        {/* Primary nav */}
        <nav className="topnav__right" aria-label="Primary navigation">
          {/* Batches only when logged in */}
          {currentUser && (
            <NavLink
              exact
              to="/recipes"
              className="topnav__link"
              activeClassName="is-active"
            >
              Batches
            </NavLink>
          )}

          {/* Admin only for admin users (and implicitly logged in) */}
          {admin && (
            <NavLink
              exact
              to="/admin"
              className="topnav__link"
              activeClassName="is-active"
            >
              Admin
            </NavLink>
          )}

          {/* Auth controls */}
          {currentUser ? (
            <button
              type="button"
              className="topnav__link topnav__logout"
              onClick={handleLogout}
              aria-label="Log out"
            >
              Log out
            </button>
          ) : (
            <>
              <NavLink
                exact
                to="/login"
                className="topnav__link"
                activeClassName="is-active"
              >
                Sign In
              </NavLink>

              <NavLink
                exact
                to="/register"
                className="topnav__link topnav__cta"
                activeClassName="is-active"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}