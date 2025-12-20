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