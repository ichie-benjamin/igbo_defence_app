import { configureStore } from "@reduxjs/toolkit";


import tabReducer from "./tabSlice";
import authReducer from "./authSlice";
import mainScreenReducer from "./mainScreenReducer";
import configReducer from "./configSlice";


const store = configureStore({
    reducer: {
        tab: tabReducer,
        config : configReducer,
        mainScreenInit: mainScreenReducer,
        auth: authReducer,
    },
});

export default store;
