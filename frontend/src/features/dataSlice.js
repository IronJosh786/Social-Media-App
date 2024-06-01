import axios from "../axios.js";
import { base } from "../baseUrl.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  page: 1,
  allPosts: true,
  error: "",
  loading: true,
};

export const fetchData = createAsyncThunk(
  "data/fetchData",
  async ({ page, limit }) => {
    try {
      const response = await axios.get(
        `${base}/api/v1/post/get-all-posts?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

export const fetchFollowingsData = createAsyncThunk(
  "data/fetchFollowingsData",
  async ({ page, limit }) => {
    try {
      const response = await axios.get(
        `${base}/api/v1/post/get-followings-post?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFollowingsData.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchFollowingsData.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchFollowingsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage, setAllPosts } = dataSlice.actions;
export default dataSlice.reducer;
