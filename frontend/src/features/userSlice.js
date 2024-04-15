import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage } from "../localStorage.js";
import { setLocalStorage } from "../localStorage.js";

const initialState = {
  isLoggedIn: getLocalStorage("isLoggedIn") ? true : false,
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
      setLocalStorage("isLoggedIn", action.payload);
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { toggleLoggedIn, setUserData } = userSlice.actions;
export default userSlice.reducer;
