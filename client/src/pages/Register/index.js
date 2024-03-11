import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import userService from "../../services/userService";
import { validatePassword } from '../../utils/validationUtils';
const Register = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        specialChar: false,
        uppercase: false,
        lowercase: false,
        digit: false,
    });

    // Handle Inputs
    const handleInput = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        setUser({ ...user, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        const validationErrors = validateForm(user);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await userService.registerUser(user);
                const { userData } = response;
                if (userData) {
                    message.success("User created successfully");
                    navigate("/login");
                }
            } catch (error) {
                message.error(error.response.data);
            }
        } else {
            setErrors(validationErrors);
        }
    }

    const validateForm = (userData) => {
        const errors = {};

        if (!userData.name) {
            errors.name = 'Name is required';
        }

        if (!userData.username) {
            errors.username = 'Username is required';
        }

        if (!userData.password) {
            errors.password = 'Password is required';
        } else {
            const validationResults = validatePassword(userData.password);
            setPasswordValidation(validationResults);

            if (!validationResults.length) {
                errors.password = 'Password must meet all criteria';
            }
        }

        return errors;
    };

    const renderValidationStatus = (isValid) => {
        return isValid ? (
            <i className="fa fa-check text-success"></i>
        ) : (
            <i className="fa fa-times text-danger"></i>
        );
    };

    return (
        <div>
            <div className="container shadow my-5">
                <div className="row justify-content-end">
                    <div className="col-md-5 d-flex flex-column align-items-center form text-white justify-content-center order-2">
                        <h1 className="display-4 fw-bolder">Hello</h1>
                        <p className="lead text-center">Enter Your Details To Register</p>
                        <h5 className="mb-4">OR</h5>
                        <NavLink to="/login" className="btn btn-outline-light rounded-pill pb-2 w-50">
                            Login
                        </NavLink>
                    </div>
                    <div className="col-md-6 p-5">
                        <form onSubmit={handleSubmit} method="POST">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInput}
                                />
                                {errors.name && <div className="text-danger">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    onChange={handleInput}
                                    value={user.username}
                                />
                                {errors.username && (
                                    <div className="text-danger">{errors.username}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Password
                                </label>
                                <div className="password-input">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        name="password"
                                        value={user.password}
                                        onChange={handleInput}
                                    />
                                    <div>
                                        Length {renderValidationStatus(passwordValidation.length)} <br />
                                        Special Character {renderValidationStatus(passwordValidation.specialChar)} <br />
                                        Uppercase {renderValidationStatus(passwordValidation.uppercase)} <br />
                                        Lowercase {renderValidationStatus(passwordValidation.lowercase)} <br />
                                        Digit {renderValidationStatus(passwordValidation.digit)}
                                    </div>
                                </div>
                                {errors.password && (
                                    <div className="text-danger">{errors.password}</div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-outline-primary w-100 mt-4 rounded-pill">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
