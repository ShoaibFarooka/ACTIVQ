import axiosInstance from './axiosInstance';

const infoService = {
    getCompanyInfo: async () => {
        try {
            const response = await axiosInstance.get('/info/get-company-info');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateCompanyInfo: async (payload) => {
        try {
            const response = await axiosInstance.put('/info/update-company-info', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default infoService;