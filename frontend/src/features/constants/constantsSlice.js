import { createSlice, current } from "@reduxjs/toolkit";
import { getInterests, getUserInterests } from "./constantsReducers.js";
import { resetBlog } from "../blog/blogSlice.js";

const initialState = {
  interests: [],
  userInterests: [],
  currentInterest: "Latest",
  blogByInterest: {},
  loading: false,
  error: null,
};

const constantsSlice = createSlice({
  name: "constants",
  initialState,
  reducers: {
    setCurrentInterest(state, action) {
      state.currentInterest = action.payload;
    },
    setBlogByInterest(state, action) {
      state.blogByInterest[action.payload.interest] = action.payload.blogs;
    },
    removerBlogByInterest(state, action) {
      state.blogByInterest[action.payload.interest] = [];
    },
    resetBlogByInterest(state, action) {
      state.blogByInterest = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInterests.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.interests = action.payload;
        if (state.userInterests.length === 0) {
          state.userInterests = ["Latest", ...action.payload];
        }
        state.error = null;
      })
      .addCase(getInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getUserInterests.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.userInterests = [
          ...new Set([...action.payload, ...state.interests]),
        ];
        state.error = null;
      })
      .addCase(getUserInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default constantsSlice.reducer;

export const {
  setCurrentInterest,
  setBlogByInterest,
  removerBlogByInterest,
  resetBlogByInterest,
} = constantsSlice.actions;
