import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    errorMessage: null,
    userType: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signinStart: (state) => {
            state.loading = true;
            state.errorMessage = null;
        },
        signinSuccess: (state, action) => {
            state.currentUser = action.payload.user;
            state.userType = action.payload.userType;
            state.loading = false;
            state.errorMessage = null;
        },
        signinFailure: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.errorMessage = null;
            state.userType = null;
        },
    },
});

export const { signinStart, signinSuccess, signinFailure, signOut } = userSlice.actions;
export default userSlice.reducer;
