import axiosInstance from './axiosInstance';

const clientService = {
    getClients: async () => {
        try {
            const response = await axiosInstance.get('/clients/get-clients');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteClient: async (clientId) => {
        try {
            const response = await axiosInstance.delete(`/clients/delete-client/${clientId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addClient: async (payload) => {
        try {
            const response = await axiosInstance.post('/clients/add-client', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateClient: async (payload, clientId) => {
        try {
            const response = await axiosInstance.put(`/clients/update-client/${clientId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default clientService;