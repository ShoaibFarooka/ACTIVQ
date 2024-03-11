import Cookies from 'js-cookie';
import userService from '../services/userService';
import { message } from 'antd';

const isAuthenticated = () => {
    const token = Cookies.get('activq-jwt-token');
    return !!token;
};

const getUserRole = async () => {
    try {
        const response = await userService.getUserRole();
        if (response.role) {
            return response.role;
        }
        return null;
    } catch (error) {
        message.error(error.response.data);
        return null;
    }
}
const verifyAuthorization = (role) => {
    const allowedPages = {
        manager: ['/home', '/users', '/clients', '/equipments','/issue-calibration-report'],
        employee: ['/home', '/issue-calibration-report'],
    };
    if (role === 'admin') {
        return true;
    }
    return allowedPages[role]?.includes(window.location.pathname);
};

export { isAuthenticated, getUserRole, verifyAuthorization };