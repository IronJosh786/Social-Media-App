import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  expiryTime: parseInt(localStorage.getItem("expiryTime"), 10) || 0,
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
      localStorage.setItem("isLoggedIn", action.payload);
    },
    setExpiryTime: (state, action) => {
      state.expiryTime = action.payload;
      localStorage.setItem("expiryTime", JSON.stringify(action.payload));
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { toggleLoggedIn, setUserData, setExpiryTime } = userSlice.actions;
export default userSlice.reducer;
