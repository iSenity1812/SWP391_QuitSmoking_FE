
import React, { useState } from "react";

import './Login.css'
interface LoginData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: "",
    })
    const [message, setMessage] = useState<string>("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }));
    };
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!formData.email && !formData.password) {
            setMessage("Please Fill the information");
            return;
        } else if (!formData.email || !formData.password) {
            setMessage("Please enter correct username or password");
            return;
        }
        setMessage("Login success");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Login</h1>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input

                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="password">password</label>
                        <input

                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-option">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="Forgot-password">Forgot password ?</a>
                    </div>
                    <button type="submit" className="login-button">Log in</button>
                    {message && <div className="message"  >{message}</div>}
                    <div className="divider">
                        <span>Don't have an account</span>
                    </div>

                    <p className="signup-link">
                        <a href="/Register">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login;