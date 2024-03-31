import axiosInstance from "./axiosInstance";

const qmsService = {
  uploadReport: async ({ type, file }) => {
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);

      const response = await axiosInstance.post(
        "/qms/upload-report",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getReports: async ({ type }) => {
    try {
      const response = await axiosInstance.post("/qms/get-reports", { type });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteReport: async ({ id }) => {
    try {
      const response = await axiosInstance.post("/qms/delete-report", { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default qmsService;
