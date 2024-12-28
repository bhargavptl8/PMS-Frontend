import { createSlice } from '@reduxjs/toolkit'

export const toastifySlice = createSlice({
    name: 'toast',
    initialState: {
        open: false,
        message: "",
        severity: ""
    },
    reducers: {
        ToastAction: (state, action) => {
            return {
                ...state,
                open: action.payload?.open || true,
                message: action.payload?.message,
                severity: action.payload?.severity
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { ToastAction } = toastifySlice.actions

export default toastifySlice.reducer