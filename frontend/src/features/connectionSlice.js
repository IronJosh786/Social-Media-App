import axios from "../axios.js";
import { base } from "../baseUrl.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  followers: [],
  followings: [],
  requestError: "",
  followersError: "",
  followingsError: "",
};

export const fetchRequests = createAsyncThunk(
  "connection/fetchRequests",
  async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-pending-requests`
      );
      if (response.data.message === "No pending requests") {
        return [];
      }
      return response.data.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  "connection/fetchFollowers",
  async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-followers`
      );
      if (response.data.message === "No followers") {
        return [];
      }
      return response.data.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

export const fetchFollowings = createAsyncThunk(
  "connection/fetchFollowings",
  async () => {
    try {
      const response = await axios.get(
        `${base}/api/v1/connection/get-following`
      );
      if (response.data.message === "No followings") {
        return [];
      }
      return response.data.data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state, action) => {
        state.requestError = "";
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
        state.requestError = "";
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.requests = [];
        state.requestError = action.error.message;
      })
      .addCase(fetchFollowers.pending, (state, action) => {
        state.followersError = "";
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
        state.followersError = "";
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.followers = [];
        state.followersError = action.error.message;
      })
      .addCase(fetchFollowings.pending, (state, action) => {
        state.followingsError = "";
      })
      .addCase(fetchFollowings.fulfilled, (state, action) => {
        state.followings = action.payload;
        state.followingsError = "";
      })
      .addCase(fetchFollowings.rejected, (state, action) => {
        state.followings = [];
        state.followingsError = action.error.message;
      });
  },
});

export default connectionSlice.reducer;
