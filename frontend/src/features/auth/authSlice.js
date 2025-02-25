import { createSlice } from "@reduxjs/toolkit";
import { login, logout, register, verifyOtp } from "./authReducers.js";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, actions) => {
      state.user = actions.payload;
      state.loading = false;
      state.error = null;
    },
    setErrorMessage: (state, actions) => {
      state.error = actions.payload;
    },
    setUserBio: (state, actions) => {
      state.user.bio = actions.payload;
    },
    setUserAvatar: (state, actions) => {
      state.user.avatar = actions.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // logout
      .addCase(logout.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // register
      .addCase(register.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // verifyOtp
      .addCase(verifyOtp.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUser, setErrorMessage, setUserBio, setUserAvatar } =
  authSlice.actions;

export default authSlice.reducer;
