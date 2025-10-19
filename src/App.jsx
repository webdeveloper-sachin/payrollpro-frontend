import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Navbar from './components/Navbar'
import { AuthContext } from './context/AuthContext'
import UserProfile from './pages/UserPage'
import WorkSummary from './components/WorkSummary'


const App = () => {
  const { user, loading } = useContext(AuthContext)
  if (loading) return <div className="p-6">Loading...</div>


  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/working-summary" element={<WorkSummary />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}


export default App