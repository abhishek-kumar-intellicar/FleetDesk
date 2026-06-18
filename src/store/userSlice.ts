import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "commandcenter-user";

export interface UserProfile {
  userid: string;
  username: string;
  meta: Record<string, unknown>;
  email: string;
  mobile: string | null;
  createdat: number;
  updatedat: number;
  version: number;
}

export interface SigninData {
  userprofile: UserProfile;
  newaccount: boolean;
}

export interface SigninResponse {
  err: unknown;
  data: SigninData;
  msg: string;
}

interface UserState {
  user: UserProfile | null;
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

const initialState: UserState = {
  user: getStoredUser(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
