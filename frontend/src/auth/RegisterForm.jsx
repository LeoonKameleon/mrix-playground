import React, { useState } from 'react';

const RegisterForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/auth/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Account created successfully! Switching to login...");
                setTimeout(() => onSwitchToLogin(), 2000);
            } else {
                const errorMsg = data.detail || (data.username ? `Username: ${data.username[0]}` : "Registration failed.");
                setError(errorMsg);
            }
        } catch (err) {
            setError("Server connection error.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Create Account</h2>
            
            {error && <div className="error-msg">{error}</div>}
            {message && <div className="success-msg">{message}</div>}

            <input 
                type="text" 
                placeholder="Username" 
                required
                onChange={e => setFormData({...formData, username: e.target.value})} 
            />
            <input 
                type="email" 
                placeholder="Email Address" 
                required
                onChange={e => setFormData({...formData, email: e.target.value})} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                required
                onChange={e => setFormData({...formData, password: e.target.value})} 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                required
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
            />

            <button type="submit" className="btn-submit">Register</button>
            
            <p className="switch-text">
                Already have an account? <span onClick={onSwitchToLogin}>Log in</span>
            </p>
        </form>
    );
};

export default RegisterForm;