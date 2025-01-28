import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    online: false,
};

const onlineSlice = createSlice({
    name: "online_status",
    initialState,
    reducers: {
        setOnline: (state, action) => {
            state.online = action.payload;
        },
    },
});

export const { setOnline } = onlineSlice.actions;

export default onlineSlice.reducer;
