import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content[action.payload.index] = action.payload.content;
    },
  },
});

export default blogSlice.reducer;
export const { setContent } = blogSlice.actions;
