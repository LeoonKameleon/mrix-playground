import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const LoginForm = ({onLoginSuccess}) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });

        if (res.ok) {
            const data = await res.json();
            login(data);
            if (onLoginSuccess) onLoginSuccess();
        } else {
            alert("Login error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <input type="text" placeholder="Username" onChange={e => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} />
            <button type="submit" className="btn-submit">Log in</button>
        </form>
    );
};

export default LoginForm;