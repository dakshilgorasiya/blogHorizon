import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import blogReducer from "../features/blog/blogSlice.js";
import constantsReducer from "../features/constants/constantsSlice.js";
import notificationReducer from "../features/notification/notificationSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    constants: constantsReducer,
    notification: notificationReducer,
  },
});

export default store;
