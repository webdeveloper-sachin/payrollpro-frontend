import React, { createContext, useState, useEffect } from 'react'
import API from '../api/axios'


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        if (token && userStr) setUser(JSON.parse(userStr))
        setLoading(false)
    }, [])


    const login = async (email, password) => {
        const res = await API.post('/api/v1/auth/login', { email, password })
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }


    const register = async (name, email, password, role = 'user') => {
        const res = await API.post('/api/v1/auth/register', { name, email, password, role })
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


    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}