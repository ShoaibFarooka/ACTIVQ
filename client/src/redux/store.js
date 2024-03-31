import { configureStore } from "@reduxjs/toolkit";
import loaderSlice  from "./loaderSlice";
import companySlice from "./companySlice";
import qmsSlice from "./qmsSlice";

const store = configureStore({
    reducer: {
        company: companySlice,
        loader: loaderSlice,
        qms: qmsSlice
    },
});

export default store;