import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../styles/Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { message } from 'antd';
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import infoService from '../services/infoService';
import userService from '../services/userService';

const Navbar = () => {
    const [companyInfo, setCompanyInfo] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchInfo = async () => {
        dispatch(ShowLoading());
        try {
            const response = await infoService.getCompanyInfo();
            if (response.info) {
                const filteredInfo = response.info;
                delete filteredInfo.__v;
                setCompanyInfo(filteredInfo);
            }
        } catch (error) {
            if (error.response.data !== 'Info not found') {
                message.error(error.response.data);
            }
        }
        await fetchUserName();
        dispatch(HideLoading());
    };

    const fetchUserName = async () => {
        try {
            const response = await userService.getUserName();
            if (response.name) {
                setUserName(response.name);
            }
        } catch (error) {
            message.error(error.response.data);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleLogout = () => {
        Cookies.remove('activq-jwt-token');
        navigate('/login');
    };

    return (
        <div className="Navbar">
            <div className="NavRow bg-body-tertiary navabar-light shadow">
                <div className="NavLinks">
                    <div className='flex-link'>
                        <NavLink
                            className="navbar-brand fw-bolder mx-auto"
                            to="/home"
                        >
                            <img src={companyInfo?.logo ? companyInfo.logo : logo} className='logo' alt="Auction logo" />
                        </NavLink>
                        <NavLink
                            className="navbar-brand mx-auto title"
                            to="/home"
                        >
                            {companyInfo?.name ? companyInfo?.name : 'ACTIV-Q'}
                        </NavLink>
                    </div>
                    <NavLink className={(navData) => navData.isActive ? 'active-link nav-page' : 'non-active-link nav-page'} to="/home">
                        Home
                    </NavLink>

                </div>
                <div className='flex-link'>
                    <div className='username'>{userName ? userName : ''}</div>
                    <div className="btn-div">
                        <button className="logout-btn btn btn-outline-primary ms-auto rounded-pill" onClick={handleLogout}>
                            <i className="fa fa-sign-in me-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
