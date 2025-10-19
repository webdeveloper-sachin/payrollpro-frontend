import React, { createContext, useState, useEffect } from 'react'
import API from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch user from backend if token exists
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token')
            if (!token) return setLoading(false)

            try {
                const res = await API.get('/api/v1/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(res.data.data.user)
                localStorage.setItem('user', JSON.stringify(res.data.data.user))
            } catch (err) {
                logout()
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    const login = async (email, password) => {
        const res = await API.post('/api/v1/auth/login', { email, password })
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    const register = async (name, email, password, role = 'user', salary) => {
        const res = await API.post('/api/v1/auth/register', { name, email, password, role, salary })
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser: updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}
