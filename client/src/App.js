import './App.css'
import Layout from './layouts/Layout'
import Login from './screens/Login'
import Register from './screens/Register'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { loginUser, registerUser, verifyUser } from './services/auth'


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
    history.push('/');
  }

  const handleRegister = async (formData) => {
    const userData = await registerUser(formData);
    setCurrentUser(userData)
  }

  return (
    <div className="App">
      <Layout currentUser={currentUser}>
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
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
