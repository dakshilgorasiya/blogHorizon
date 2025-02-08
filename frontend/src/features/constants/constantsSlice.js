import { createSlice } from "@reduxjs/toolkit";
import { getInterests } from "./constantsReducers.js";

const initialState = {
  interests: [],
  loading: false,
  error: null,
}

const constantsSlice = createSlice({
  name: "constants",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getInterests.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.interests = action.payload;
        state.error = null;
      })
      .addCase(getInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default constantsSlice.reducer;