import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./layouts/Layout";

// Pages (NEW STRUCTURE)
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";

// App container
import MainContainer from "./containers/MainContainer";

// Auth
import { loginUser, registerUser, removeToken, verifyUser } from "./services/auth";

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

  const handleLogin = async (formData) => {
    try {
      const user = await loginUser(formData); // should set token inside service
      setCurrentUser(user);
      history.push("/home");
    } catch (err) {
      // Let the Login component display its existing error UI
      throw err;
    }
  };

  const handleRegister = async (formData) => {
    try {
      // 1) Create user (often returns user record, but NOT a token)
      await registerUser(formData);

      // 2) Immediately log them in to establish token/session
      const user = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      setCurrentUser(user);
      history.push("/home");
    } catch (err) {
      // If register/login fails, do not land on /home
      setCurrentUser(null);
      throw err;
    }
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
          {currentUser ? <Redirect to="/home" /> : <Login handleLogin={handleLogin} />}
        </Route>

        <Route path="/register">
          {currentUser ? (
            <Redirect to="/home" />
          ) : (
            <Register handleRegister={handleRegister} />
          )}
        </Route>

        {/* Authenticated */}
        <Route path="/home">
          {currentUser ? <Home /> : <Redirect to="/login" />}
        </Route>

        <Route path="/recipes">
          {currentUser ? <MainContainer currentUser={currentUser} /> : <Redirect to="/login" />}
        </Route>

        {/* Fallback */}
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
}

export default App;