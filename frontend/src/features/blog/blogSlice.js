import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.content[action.payload.index] = {
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    removeContent: (state, action) => {
      const oldContent = state.content;
      oldContent.splice(action.payload.index, 1);
      state.content = oldContent;
    },
  },
});

export default blogSlice.reducer;
export const { setContent, removeContent } = blogSlice.actions;
