import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { toggleLoggedIn } = userSlice.actions;
export default userSlice.reducer;
