import { createSlice } from "@reduxjs/toolkit";
import qmsService from "../services/qmsService";

export const qmsSlice = createSlice({
  name: "qms",
  initialState: {
    reports: []
  },
  reducers: {
    setReports(state, action) {
      return {
        reports: [...action.payload]
      }
    }
  },
});

export const { setReports } = qmsSlice.actions;

// Async action to fetch company information
export const getAllQmsReports = () => async (dispatch) => {
  try {
    const response = await qmsService.getReports({ type: '*' });
    if (response) {
      dispatch(setReports(response));
    }
  } catch (error) {
    // Handle error if needed
    console.error("Error fetching QMS information:", error);
  }
};

export default qmsSlice.reducer;
