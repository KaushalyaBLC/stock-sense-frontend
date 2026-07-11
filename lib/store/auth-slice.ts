import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PublicUser } from "@/lib/api";

/**
 * Client-side auth state holds only the public user for UI purposes.
 * Tokens live in httpOnly cookies (set by the BFF route handlers) and are
 * never exposed to client JS.
 */
type AuthState = {
  user: PublicUser | null;
};

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<PublicUser | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
