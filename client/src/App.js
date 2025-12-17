import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Layout from './layouts/Layout';

// Pages (NEW STRUCTURE)
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UserHome from './pages/UserHome/UserHome';

// App container
import MainContainer from './containers/MainContainer';

// Auth
import {
  loginUser,
  registerUser,
  removeToken,
  verifyUser
} from './services/auth';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const verify = async () => {
      const user = await verifyUser();
      setCurrentUser(user);
    };
    verify();
  }, []);

  const handleLogin = async (formData) => {
    const user = await loginUser(formData);
    setCurrentUser(user);
    history.push('/home');
  };

  const handleRegister = async (formData) => {
    const user = await registerUser(formData);
    setCurrentUser(user);
    history.push('/home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    removeToken();
    history.push('/');
  };

  return (
    <Layout currentUser={currentUser} handleLogout={handleLogout}>
      <Switch>
        {/* Public */}
        <Route exact path="/" component={Landing} />
        <Route path="/login">
          <Login handleLogin={handleLogin} />
        </Route>
        <Route path="/register">
          <Register handleRegister={handleRegister} />
        </Route>

        {/* Authenticated */}
        <Route path="/home">
          {currentUser ? <UserHome /> : <Redirect to="/login" />}
        </Route>

        {/* App pages */}
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