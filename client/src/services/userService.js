import axiosInstance from './axiosInstance';

const userService = {
    getUserRole: async () => {
        try {
            const response = await axiosInstance.get('/users/get-user-role');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUserName: async () => {
        try {
            const response = await axiosInstance.get('/users/get-user-name');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    registerUser: async (payload) => {
        try {
            const response = await axiosInstance.post('/users/register', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    loginUser: async (payload) => {
        try {
            const response = await axiosInstance.post('/users/login', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUsers: async () => {
        try {
            const response = await axiosInstance.get('/users/get-users');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.delete(`/users/delete-user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addUser: async (payload) => {
        try {
            const response = await axiosInstance.post('/users/add-user', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (payload, userId) => {
        try {
            const response = await axiosInstance.put(`/users/update-user/${userId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getUsersForCalibration: async () => {
        try {
            const response = await axiosInstance.get('/users/get-users-for-calibration');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;