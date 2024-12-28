import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './toastify/toastSlice'

const store = configureStore({
    reducer: {
        toastify: toastReducer
    }
})

export default store;