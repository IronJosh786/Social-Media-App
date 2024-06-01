import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice.js";
import themeReducer from "../features/themeSlice.js";
import dataReducer from "../features/dataSlice.js";
import connectionReducer from "../features/connectionSlice.js";

export default configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    data: dataReducer,
    connection: connectionReducer,
  },
});
