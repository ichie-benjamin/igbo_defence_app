import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    auth_user: false,
    show_balance: false,
    current_user : null,
    transactions : [],
    lives : [],
    loading: false,
    userToken: null, // for storing the JWT
    error: null,
    push_token: null,
    success: false, // for monitoring the registration process.
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.current_user = action.payload;
            state.auth_user = true;
        },

        setLogout: (state) => {
            state.current_user = null;
            state.auth_user = false;
            state.userToken = null
        },
        setAuthStatus: (state, action) => {
            state.auth_user = action.payload
        },
        setTransactions: (state, action) => {
            state.transactions = action.payload
        },
        setLives: (state, action) => {
            state.lives = action.payload
        },
        setAuthToken: (state, action) => {
            state.userToken = action.payload
        },
        setPToken: (state, action) => {
            state.push_token = action.payload
        },
        toggleShowBalance: (state, action) => {
            state.show_balance = action.payload
        },
    },
})

export const { setCurrentUser, setLives, setPToken, toggleShowBalance, setLogout, setAuthStatus, setAuthToken, setTransactions  } = authSlice.actions;

export default authSlice.reducer
