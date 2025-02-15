import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blog: {
    id: "",
    title: "",
    content: [],
    author: "",
    views: 0,
    date: "",
    likes: 0,
    comments: 0,
    category: "",
    tags: [],
  },
  loading: false,
  error: "",
  isDataFromAPI: false,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
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
  },
});

export default blogSlice.reducer;
export const { setContent, removeContent, setTitle, setCategory, setTags } =
  blogSlice.actions;
