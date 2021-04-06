import './App.css'
import Layout from './layouts/Layout'
import Login from './screens/Login'
import Register from './screens/Register'
import Landing from './screens/Landing'
import MainContainer from './containers/MainContainer'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { loginUser, registerUser, removeToken, verifyUser } from './services/auth'


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory()

  useEffect(() => {
    const handleVerify = async () => {
      const userData = await verifyUser()
      setCurrentUser(userData);
    }
    handleVerify();
  }, [])

  const handleLogin = async (formData) => {
    const userData = await loginUser(formData);
    setCurrentUser(userData);
    history.push('/home');
  }

  const handleRegister = async (formData) => {
    const userData = await registerUser(formData);
    setCurrentUser(userData);
    history.push('/home');
  }

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    history.push('/login');
    removeToken();
  }

  return (
    <div style={{ 
      backgroundImage: `url("https://i.imgur.com/II8Rvqp.jpg")` 
    }}>
    <div className="App">
      <Layout 
      currentUser={currentUser}
      handleLogout={handleLogout}
      >
        <Switch>
          <Route path='/login'>
            <Login
            handleLogin={handleLogin}
            />
          </Route>
          <Route path='/register'>
            <Register
            handleRegister={handleRegister}
            />
          </Route>
          <Route path='/'>
            <MainContainer 
              currentUser={currentUser}
            />
            <Landing user={currentUser}/>
          </Route>
        </Switch>
      </Layout>
    </div>
    </div>
  );
}

export default App;