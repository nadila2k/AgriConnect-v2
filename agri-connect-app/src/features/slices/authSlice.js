import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../../constants/constants";
import { signIn, signUp } from "../thunks/authThunk";

const initialState = {
  isAuthenticate: false,
  status: REQUEST_STATUS.IDLE,
  error: null,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState(state) {
      state.status = REQUEST_STATUS.IDLE;
    },
    logOut(state) {
      state.isAuthenticate = false;
      state.user = {};
      state.status = REQUEST_STATUS.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = REQUEST_STATUS.PENDING;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = REQUEST_STATUS.FULFILLED;
        state.user = action.payload.data.user;
        state.isAuthenticate = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = REQUEST_STATUS.REJECTED;
        state.user = {};
        state.isAuthenticate = false;
        state.error = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.status = REQUEST_STATUS.PENDING;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = REQUEST_STATUS.FULFILLED;
        state.user = action.payload.data.user;
        state.isAuthenticate = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = REQUEST_STATUS.REJECTED;
        state.user = {};
        state.isAuthenticate = false;
        state.error = action.payload;
      });
  },
});

export const { resetState, logOut } = authSlice.actions;

export const selectIsAuthenticate = (state) => state.auth.isAuthenticate;
export const selectStatus = (state) => state.auth.status;
export const selectError = (state) => state.auth.error;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
