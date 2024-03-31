import axiosInstance from './axiosInstance';

const equipmentService = {
    getEquipments: async () => {
        try {
            const response = await axiosInstance.get('/equipments/get-equipments');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteEquipment: async (equipmentId) => {
        try {
            const response = await axiosInstance.delete(`/equipments/delete-equipment/${equipmentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addEquipment: async (payload) => {
        try {
            const response = await axiosInstance.post('/equipments/add-equipment', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateEquipment: async (payload, equipmentId) => {
        try {
            const response = await axiosInstance.put(`/equipments/update-equipment/${equipmentId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getEquipmentReport: async (equipmentId) => {
        try {
            const response = await axiosInstance.get(`/equipments/get-equipment-report/${equipmentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addCalibrationDetails: async (payload, equipmentId) => {
        try {
            const response = await axiosInstance.post(`/equipments/add-calibration-details/${equipmentId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    remindOwner: async (payload) => {
        try {
            const response = await axiosInstance.post('/equipments/remind-owner', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default equipmentService;