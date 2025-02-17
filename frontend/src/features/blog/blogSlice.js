import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blog: {
    _id: "",
    title: "",
    owner: {},
    content: [],
    category: "",
    tags: [],
    createdAt: "",
    followersCount: 0,
    commentCount: 0,
    likeCount: 0,
    isLiked: false,
    isFavorite: false,
    isFollowed: false,
  },
  loading: false,
  error: "",
  isDataFromAPI: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    resetBlog: (state, action) => {
      state.blog = initialState.blog;
    },
    setContent: (state, action) => {
      state.blog.content[action.payload.index] = {
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    removeContent: (state, action) => {
      const oldContent = state.blog.content;
      oldContent.splice(action.payload.index, 1);
      state.blog.content = oldContent;
    },
    setTitle: (state, action) => {
      state.blog.title = action.payload;
    },
    setCategory: (state, action) => {
      state.blog.category = action.payload;
    },
    setTags: (state, action) => {
      state.blog.tags = action.payload;
    },
    setApiBlog: (state, action) => {
      state.blog = action.payload;
    },
    setIsFollowed: (state, action) => {
      state.blog.isFollowed = action.payload;
      if (action.payload) {
        state.blog.followersCount += 1;
      } else {
        state.blog.followersCount -= 1;
      }
    },
    setIsLiked: (state, action) => {
      state.blog.isLiked = action.payload;
      if (action.payload) {
        state.blog.likeCount += 1;
      } else {
        state.blog.likeCount -= 1;
      }
    },
  },
});

export default blogSlice.reducer;
export const {
  setContent,
  removeContent,
  setTitle,
  setCategory,
  setTags,
  resetBlog,
  setApiBlog,
  setIsFollowed,
  setIsLiked,
} = blogSlice.actions;
