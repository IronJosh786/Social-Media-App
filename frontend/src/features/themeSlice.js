import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: JSON.parse(localStorage.getItem("theme")) || false,
};

const userSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("theme", JSON.stringify(state.darkMode));
    },
  },
});

export const { toggleTheme } = userSlice.actions;
export default userSlice.reducer;
