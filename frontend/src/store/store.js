import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import blogReducer from "../features/blog/blogSlice.js";
import constantsReducer from "../features/constants/constantsSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    constants: constantsReducer,
  },
});

export default store;
