import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type: null,
  open: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    sendNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.open = true;
    },
    setOpen: (state, action) => {
      state.open = false;
    },
  },
});

export const { sendNotification, setOpen } = notificationSlice.actions;

export default notificationSlice.reducer;
