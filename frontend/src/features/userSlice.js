import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: {
    avatar: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { toggleLoggedIn, setUserData } = userSlice.actions;
export default userSlice.reducer;
