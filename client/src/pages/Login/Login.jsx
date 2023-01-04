import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../../assets/logo.svg';
import { LoginWrapper } from './Login.styles';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../../utils/APIRoutes';

function Login() {
    const navigate = useNavigate();
    const [values, updatevalues] = useState({
        username: '',
        password: '',
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
                username, password,
            } = values;
            const { data } = await axios.post(loginRoute, {
                username, password
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
            password, username
        } = values;
        if (password === "") {
            toast.error("Password is required.", toastOptions);
            return false;
        } else if (username === "") {
            toast.error("Username is required", toastOptions);
            return false;
        }
        return true;
    }

    return (
        <div>
            <LoginWrapper>
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
                        min={3}
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                    />
                    <button
                        type="submit"
                    >
                        Login
                    </button>
                    <span>Don't have an account ? <Link to="/register">Register</Link></span>
                </form>
            </LoginWrapper>
            <ToastContainer />
        </div>
    )
}

export default Login;