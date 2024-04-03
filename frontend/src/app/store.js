import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice.js";
import themeReducer from "../features/themeSlice.js";

export default configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});
