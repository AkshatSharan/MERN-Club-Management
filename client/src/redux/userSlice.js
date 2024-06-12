import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    errorMessage: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signinStart: (state) => {
            state.loading = true
        },
        signinSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.errorMessage = false
        },
        signinFailure: (state, action) => {
            state.loading = false
            state.errorMessage = action.payload
        }
    }
})

export const { signinStart, signinSuccess, signinFailure} = userSlice.actions
export default userSlice.reducer