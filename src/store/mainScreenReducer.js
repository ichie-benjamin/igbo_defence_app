import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loadApplication: false,
    navScreen: ''
}


const mainScreenSlice = createSlice({
    name: "mainScreen",
    initialState,
    reducers: {
        requestInit: (state, action) => {
            state.loadApplication = false;
        },
        successInit: (state, action) => {
            state.loadApplication = true;
            state.navScreen = action.payload
        },
    },
});


export const { requestInit, successInit } = mainScreenSlice.actions;

export default mainScreenSlice.reducer;
