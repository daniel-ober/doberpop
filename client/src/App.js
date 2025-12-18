// client/src/App.js
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./layouts/Layout";

// Pages (NEW STRUCTURE)
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

// App container
import MainContainer from "./containers/MainContainer";

// Auth
import {
  loginUser,
  registerUser,
  removeToken,
  verifyUser,
} from "./services/auth";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await verifyUser(); // should succeed only if token exists
        setCurrentUser(user);
      } catch (err) {
        // IMPORTANT: swallow 401s so the app doesn't crash/blank
        setCurrentUser(null);
      }
    };
    verify();
  }, []);

  const isAdminUser = (user) => {
    return Boolean(
      user?.is_admin ||
        user?.isAdmin ||
        user?.admin ||
        user?.role === "admin" ||
        user?.userType === "admin"
    );
  };

  /**
   * LOGIN
   * Login form will pass:
   * - identifier (preferred)
   * or legacy:
   * - username
   */
  const handleLogin = async (formData) => {
    // Normalize to identifier so users can login via username OR email
    const payload = {
      identifier: (formData.identifier || formData.username || "").trim(),
      password: formData.password,
    };

    const user = await loginUser(payload); // sets token inside service
    setCurrentUser(user);

    // ✅ Admins go to /admin, everyone else goes to /home
    history.push(isAdminUser(user) ? "/admin" : "/home");
  };

  /**
   * REGISTER
   * 1) Create the user
   * 2) Auto-login using identifier (email is best)
   */
  const handleRegister = async (formData) => {
    // 1) Create user
    await registerUser({
      username: formData.username?.trim(),
      email: formData.email?.trim(),
      password: formData.password,
    });

    // 2) Auto-login to create token/session
    // Prefer email as identifier, fallback to username
    const identifier =
      (formData.email || "").trim() || (formData.username || "").trim();

    const user = await loginUser({
      identifier,
      password: formData.password,
    });

    setCurrentUser(user);

    // ✅ Admins go to /admin, everyone else goes to /home
    history.push(isAdminUser(user) ? "/admin" : "/home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    removeToken();
    history.push("/");
  };

  return (
    <Layout currentUser={currentUser} handleLogout={handleLogout}>
      <Switch>
        {/* Public */}
        <Route exact path="/" component={Landing} />

        <Route path="/login">
          {currentUser ? (
            <Redirect to={isAdminUser(currentUser) ? "/admin" : "/home"} />
          ) : (
            <Login handleLogin={handleLogin} />
          )}
        </Route>

        <Route path="/register">
          {currentUser ? (
            <Redirect to={isAdminUser(currentUser) ? "/admin" : "/home"} />
          ) : (
            <Register handleRegister={handleRegister} />
          )}
        </Route>

        {/* Authenticated */}
        <Route path="/admin">
          {currentUser && isAdminUser(currentUser) ? (
            <AdminDashboard />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        <Route path="/home">
          {currentUser ? <Home /> : <Redirect to="/login" />}
        </Route>

        <Route path="/recipes">
          {currentUser ? (
            <MainContainer currentUser={currentUser} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {/* Fallback */}
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default App;