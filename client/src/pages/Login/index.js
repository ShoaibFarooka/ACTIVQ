import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { message } from "antd";
import { TbEye } from "react-icons/tb";
import { TbEyeOff } from "react-icons/tb";
import userService from "../../services/userService";

const Login = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle Input
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        setUser({ ...user, [name]: value });
    };

    // Handle Login
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password } = user;
        if (!username || !password) {
            message.error('Please enter the valid data!');
            return;
        }
        try {
            const response = await userService.loginUser(user);
            if (response.token) {
                Cookies.set('activq-jwt-token', response.token, {
                    secure: true,
                    sameSite: 'Lax'
                });
                const from = location.state?.from.pathname;
                navigate(from || '/');
            }
        } catch (error) {
            message.error(error.response.data);
        }
    };

    const togglePasswordView = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className="container shadow my-5">
                <div className="row">
                    <div className="col-md-5 d-flex flex-column align-items-center text-white justify-content-center form">
                        <h1 className="display-4 fw-bolder">Welcome Back</h1>
                        <p className="lead text-center">Enter Your Credentials To Login</p>
                        <h5 className="mb-4">OR</h5>
                        <NavLink
                            to="/register"
                            className="btn btn-outline-light rounded-pill pb-2 w-50"
                        >
                            Register
                        </NavLink>
                    </div>
                    <div className="col-md-6 p-5">
                        <h1 className="display-6 fw-bolder mb-5">LOGIN</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                />
                                <div id="emailHelp" className="form-text">
                                    We'll never share your username with anyone else.
                                </div>
                            </div>
                            <div>
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Password
                                </label>
                                <div className="input-group mb-3">
                                    <br />
                                    <input
                                        type={`${showPassword ? 'text' : 'password'}`}
                                        className="input form-control"
                                        id="exampleInputPassword1"
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={togglePasswordView}>
                                            {!showPassword ? <TbEye size={25} /> : <TbEyeOff size={25} />}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 mt-4 rounded-pill"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
