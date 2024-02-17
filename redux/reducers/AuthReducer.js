import { createSlice, createAction } from "@reduxjs/toolkit";
import { updateUser } from "../actions/authAction";
const initialState = {
  userAuthData: {},
};
// const ToDo = createAction("Todo");
const AuthReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginAuthData: (state, action) => {
      state.userAuthData = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.fulfilled, (state, action) => {
      return {
        ...state,
        userAuthData: {
          ...state.userAuthData,
          ...action.payload,
        },
      };
    });
  },
});

export const { setLoginAuthData } = AuthReducer.actions;
export default AuthReducer.reducer;
