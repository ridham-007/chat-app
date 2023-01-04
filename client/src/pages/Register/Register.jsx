import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../../assets/logo.svg';
import { RegisterWrapper } from './Register.styles';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../../utils/APIRoutes';

function Register() {
    const navigate = useNavigate();
    const [values, updatevalues] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/');
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const {
                username, email, password,
            } = values;
            const { data } = await axios.post(registerRoute, {
                username, email, password
            });
            if (!data.status) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/');
            }
        }
    };

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    const handleChange = (event) => {
        updatevalues({ ...values, [event.target.id]: event.target.value });
    };

    const handleValidation = () => {
        const {
            password, confirmPassword, username, email
        } = values;
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should be same.", toastOptions);
            return false;
        } else if (username.length < 3) {
            toast.error("Username should be more than 3 characters", toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error("Password should be more than 8 characters", toastOptions);
            return false;
        } else if (email === "") {
            toast.error("Email is required", toastOptions);
            return false;
        }
        return true;
    }

    return (
        <div>
            <RegisterWrapper>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo Element" />
                        <h1>snappy</h1>
                    </div>
                    <input
                        id="username"
                        type="text"
                        placeholder="UserName"
                        name="username"
                        onChange={handleChange}
                        value={values.username}
                    />
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                    />
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={values.confirmPassword}
                    />
                    <button
                        type="submit"
                    >
                        Create User
                    </button>
                    <span>already have an account ? <Link to="/login">Login</Link></span>
                </form>
            </RegisterWrapper>
            <ToastContainer />
        </div>
    )
}

export default Register;