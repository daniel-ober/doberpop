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
import Privacy from "./pages/Privacy/Privacy";

// Forgot + Reset
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";

// Recipes
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
  const [authChecked, setAuthChecked] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const verify = async () => {
      try {
        const user = await verifyUser();

        if (user) {
          console.log("AUTH USER:", user);
          setCurrentUser(user);
        }
      } catch (err) {
        console.log("VERIFY USER FAILED:", err);
      } finally {
        setAuthChecked(true);
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
      identifier: (formData.identifier || "").trim(),
      password: formData.password,
    };

    const user = await loginUser(payload);

    console.log("LOGIN SUCCESS:", user);

    setCurrentUser(user);

    history.replace(isAdminUser(user) ? "/admin" : "/home");
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
    setCurrentUser(updatedUser);
  };

  if (!authChecked) return null;

  return (
    <Layout currentUser={currentUser} handleLogout={handleLogout}>
      <Switch>
        <Route exact path="/">
          {currentUser ? (
            <Redirect to={isAdminUser(currentUser) ? "/admin" : "/home"} />
          ) : (
            <Landing />
          )}
        </Route>

        <Route path="/login">
          {currentUser ? (
            <Redirect to={isAdminUser(currentUser) ? "/admin" : "/home"} />
          ) : (
            <Login handleLogin={handleLogin} currentUser={currentUser} />
          )}
        </Route>

        <Route path="/register">
          {currentUser ? (
            <Redirect to={isAdminUser(currentUser) ? "/admin" : "/home"} />
          ) : (
            <Register handleRegister={handleRegister} />
          )}
        </Route>

        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/privacy" component={Privacy} />

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

        <Route path="/recipes">
          <MainContainer currentUser={currentUser} />
        </Route>

        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default App;