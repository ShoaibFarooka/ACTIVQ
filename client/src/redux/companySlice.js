import { createSlice } from "@reduxjs/toolkit";
import infoService from "../services/infoService";

export const companySlice = createSlice({
  name: "loader",
  initialState: {
    address: "",
    code: "",
    logo: "",
    name: "",
    seal1: "",
    seal2: "",
    telephone: "",
  },
  reducers: {
    setCompanyInformation(state, action) {
      const { address, code, logo, name, seal1, seal2, telephone } =
        action.payload;
      console.log('D', action.payload);
      return {
        ...state,
        address,
        code,
        logo,
        name,
        seal1,
        seal2,
        telephone,
      };
    },
  },
});

export const { setCompanyInformation } = companySlice.actions;

// Async action to fetch company information
export const getCompanyInformation = () => async (dispatch) => {
  console.log('B')
  try {
    const response = await infoService.getCompanyInfo();
    if (response.info) {
      console.log('C')
      dispatch(setCompanyInformation(response.info));
    }
  } catch (error) {
    // Handle error if needed
    console.error("Error fetching company information:", error);
  }
};

export default companySlice.reducer;
