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
        resetErrorMessage: (state) => {
            state.errorMessage = null;
        },
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
        updateStart: (state) => {
            state.loading = true
        },
        updateSuccess: (state, action) => {
            state.currentUser.user = action.payload
            state.loading = false;
            state.errorMessage = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload;
        }
    },
});

export const { signinStart, signinSuccess, signinFailure, signOut, updateStart, updateSuccess, updateFailure, resetErrorMessage } = userSlice.actions;
export default userSlice.reducer;
