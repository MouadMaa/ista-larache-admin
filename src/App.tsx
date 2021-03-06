import React, { FC, useContext } from 'react'

import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Spinner from './components/UI/Spinner/Spinner'
import { AuthContext } from './context/authContext'

const App: FC = () => {
  const { user, loading } = useContext(AuthContext)

  return loading ? (
    <Spinner isPage />
  ) : user ? (
    <Dashboard />
  ) : (
    <Login />
  )
}

export default App
