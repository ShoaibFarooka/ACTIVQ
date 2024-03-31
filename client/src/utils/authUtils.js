import Cookies from 'js-cookie';
import userService from '../services/userService';
import { message } from 'antd';
import { AUTHORITY } from './constants';

const isAuthenticated = () => {
    const token = Cookies.get('activq-jwt-token');
    return !!token;
};

const getUserRole = async () => {
    try {
        const response = await userService.getUserRole();
        if (response.role || response.permissions) {
            return response;
        }
        return null;
    } catch (error) {
        message.error(error.response.data);
        return null;
    }
}
const verifyAuthorization = (role, permissions) => {
    const allowedPages = {
        manager: ['/home', '/users', '/clients', '/equipments','/issue-calibration-report'],
        employee: ['/home', '/issue-calibration-report'],
    };
    if (role === 'employee' &&  permissions.includes(AUTHORITY.level_four)) {
        allowedPages[role]?.push('/qms');
    }
    if (role === 'admin') {
        return true;
    }
    return allowedPages[role]?.includes(window.location.pathname);
};

export { isAuthenticated, getUserRole, verifyAuthorization };