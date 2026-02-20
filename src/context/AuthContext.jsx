import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        const storedRole = localStorage.getItem('role')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
            setRole(storedRole)
        }
        setLoading(false)
    }, [])

    const login = (userData, authToken, userRole) => {
        setUser(userData)
        setToken(authToken)
        setRole(userRole)
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('role', userRole)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        setRole(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
    }

    return (
        <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export default AuthContext
