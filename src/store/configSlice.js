import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    data: [],
};

const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setConfigData: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setConfigData } = configSlice.actions;

export default configSlice.reducer;
