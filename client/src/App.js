// client/src/App.js
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./layouts/Layout";

// Pages
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AccountSettings from "./pages/Account/AccountSettings";

// App container (Recipes + nested children)
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
        const user = await verifyUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };
    verify();
  }, []);

  const isAdminUser = (user) =>
    Boolean(
      user?.is_admin ||
        user?.isAdmin ||
        user?.admin ||
        user?.role === "admin" ||
        user?.userType === "admin"
    );

  const handleLogin = async (formData) => {
    const payload = {
      identifier: (formData.identifier || formData.username || "").trim(),
      password: formData.password,
    };

    const user = await loginUser(payload);
    setCurrentUser(user);

    history.push(isAdminUser(user) ? "/admin" : "/home");
  };

  const handleRegister = async (formData) => {
    await registerUser({
      username: formData.username?.trim(),
      email: formData.email?.trim(),
      password: formData.password,
    });

    const identifier =
      (formData.email || "").trim() || (formData.username || "").trim();

    const user = await loginUser({
      identifier,
      password: formData.password,
    });

    setCurrentUser(user);
    history.push(isAdminUser(user) ? "/admin" : "/home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    removeToken();
    history.push("/");
  };

  const handleAccountUpdated = (updatedUser) => {
    // keep App state in sync after settings change
    setCurrentUser(updatedUser);
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

        {/* Authenticated-only pages */}
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

        <Route path="/account">
          {currentUser ? (
            <AccountSettings
              currentUser={currentUser}
              onAccountUpdated={handleAccountUpdated}
            />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {/* Recipes index + detail are PUBLIC.
            MainContainer internally protects create/edit. */}
        <Route path="/recipes">
          <MainContainer currentUser={currentUser} />
        </Route>

        {/* Fallback */}
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default App;