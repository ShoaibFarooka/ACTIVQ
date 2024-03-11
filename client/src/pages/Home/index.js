import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getUserRole } from '../../utils/authUtils';

const getMenuItems = (userRole) => {
    switch (userRole) {
        case 'admin':
            return [
                { label: 'Company Information', link: '/company-information' },
                { label: 'Users', link: '/users' },
                { label: 'Clients', link: '/clients' },
                { label: 'Equipments', link: '/equipments' },
                { label: 'Issue Calibration Report', link: '/issue-calibration-report' },
            ];
        case 'manager':
            return [
                { label: 'Users', link: '/users' },
                { label: 'Clients', link: '/clients' },
                { label: 'Equipments', link: '/equipments' },
                { label: 'Issue Calibration Report', link: '/issue-calibration-report' },
            ];
        case 'employee':
            return [
                { label: 'Issue Calibration Report', link: '/issue-calibration-report' },
            ];
        default:
            return [];
    }
};

const Home = () => {
    const [userRole, setUserRole] = useState(null);
    const dispatch = useDispatch();

    const fetchUserRole = async () => {
        dispatch(ShowLoading());
        const role = await getUserRole();
        setUserRole(role);
        dispatch(HideLoading());
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    const renderMenu = (role) => {
        const menuItems = getMenuItems(role);
        return (
            <div className="menu">
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.link} className="menu-item">
                        {item.label}
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className='Home'>
            {userRole &&
                renderMenu(userRole)
            }
        </div>
    );
};

export default Home;
