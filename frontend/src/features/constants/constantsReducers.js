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
