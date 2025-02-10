import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants.js";

export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    const response = await axios
      .post(`${server}/user/login`, data, {
        withCredentials: true,
      })
      .then((res) => res.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.post(`${server}/user/logout`, null, {
      withCredentials: true,
    });
    return null;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});

export const register = createAsyncThunk("auth/register", async (data) => {
  try {
    const response = await axios
      .post(`${server}/user/register`, data, {
        withCredentials: true,
      })
      .then((res) => res.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (data) => {
  try {
    const response = await axios
      .post(`${server}/user/verify-otp`, data, {
        withCredentials: true,
      })
      .then((res) => res.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
});