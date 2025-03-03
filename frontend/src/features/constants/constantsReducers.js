import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants.js";

export const getInterests = createAsyncThunk(
  "constants/getInterests",

  async () => {
    try {
      const response = await axios
        .get(`${server}/blog/getInterests`, null, {
          withCredentials: true,
        })
        .then((res) => res.data);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const getUserInterests = createAsyncThunk(
  "constants/getUserInterests",
  async ({ dispatch, setError, accessToken }) => {
    try {
      const response = await axios
        .get({
          url: `${server}/user/user-interests`,
          method: "GET",
          setError,
          accessToken,
          dispatch,
        })
        .then((res) => res.data);

      const newList = ["Latest", ...response.data];

      return newList;
    } catch (error) {
      throw new Error(error?.response?.data?.message || "Something went wrong");
    }
  }
);
