import { configureStore } from "@reduxjs/toolkit";
import loaderSlice  from "./loaderSlice";
import companySlice from "./companySlice";

const store = configureStore({
    reducer: {
        company: companySlice,
        loader: loaderSlice
    },
});

export default store;