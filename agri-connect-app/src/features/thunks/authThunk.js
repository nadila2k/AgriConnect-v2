import { createAsyncThunk } from "@reduxjs/toolkit";
import apiHelper from "../apiHelper";

const signIn = createAsyncThunk("auth/signIn", async (user, thunkAPI) => {
  const requestOptions = {
    url: `/auth/signIn`,
    data: user,
  };
  return apiHelper("post", requestOptions, thunkAPI);
});

const signUp = createAsyncThunk("auth/signUp", async (user, thunkAPI) => {
  const requestOptions = {
    url: `/auth/signUp`,
    data: user,
  };
  return apiHelper("post", requestOptions, thunkAPI);
});

export { signIn, signUp };
