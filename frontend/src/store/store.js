import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import constantsReducer from "../features/constants/constantsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    constants: constantsReducer,
  },
});

export default store;
