import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  signinLoading: boolean;
}

const initialState: AuthState = {
  signinLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSigninLoading: (state, action: { payload: boolean }) => {
      state.signinLoading = action.payload;
    },
  },
});

export const { setSigninLoading } = authSlice.actions;
export default authSlice.reducer;
