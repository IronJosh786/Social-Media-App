import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice.js";
import themeReducer from "../features/themeSlice.js";
import dataReducer from "../features/dataSlice.js";

export default configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    data: dataReducer,
  },
});
