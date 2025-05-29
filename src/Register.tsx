import React, { useState } from "react";
import './Login.css'

type Gender = "male" | "female";
interface RegisterData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    age: number | "";
    gender: Gender;

}
const initialState: RegisterData = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "male",
};
const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterData>(initialState);
    const [message, setMessage] = useState<string>("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault;
        if (
            !formData.firstname ||
            !formData.lastname ||
            !formData.email ||
            !formData.username ||
            !formData.phone ||
            !formData.age
        ) {
            setMessage("Please enter all require information")
        }
        setMessage("");
        setFormData(initialState);
    }
    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Register</h1>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="firstname">Firstname</label>
                        <input

                            type="text"
                            id="firstname"
                            name="firsname"
                            placeholder="Enter your firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="form-input"
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">lastname</label>
                        <input

                            type="text"
                            id="lastname"
                            name="lastname"
                            placeholder="Enter your lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">username</label>
                        <input

                            type="text"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
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
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            className="form-input"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <button type="submit" className="login-button">Log in</button>
                    {message && <div className="message"  >{message}</div>}
                    <div className="divider">
                        <span>Already got an account</span>
                    </div>

                    <p className="signup-link">
                        <a href="/Login">Sign in</a>
                    </p>

                </form>
            </div>
        </div>
    );
}
export default Register;