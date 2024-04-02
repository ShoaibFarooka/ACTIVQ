import axiosInstance from "./axiosInstance";

const qmsService = {
  uploadReport: async ({ category, file }) => {
    try {
      const formData = new FormData();
      formData.append("category", category);
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
  deleteReport: async ({ fileId }) => {
    try {
      const response = await axiosInstance.post("/qms/delete-report", { fileId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  downloadReport: async ({ fileId, contentType }) => {
    try {
      const response = await axiosInstance.post("/qms/download-report", { fileId }, {
        responseType: 'arraybuffer',
        headers: {
          Accept: contentType,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default qmsService;
