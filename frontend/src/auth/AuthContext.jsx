import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem("access"));
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("username");
        return saved && saved !== "undefined" ? { username: saved } : null;
    });

    const login = (data) => {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('username', data.username);
        setToken(data.access);
        setUser({ username: data.username });
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refresh');
        const access = localStorage.getItem('access');

        try {
            await fetch("http://localhost:8000/api/auth/logout/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`
                },
                body: JSON.stringify({ refresh })
            });
        } catch (err) {
            console.error("Logout on backend failed, but clearing local session anyway.");
        }

        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}