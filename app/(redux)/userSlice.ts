import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  token: string | null;
  professionalId: string | null;
  profileImage: string | null; // Add profileImage field
}

const initialState: UserState = {
  id: null,
  email: null,
  username: null,
  firstName: null,
  lastName: null,
  token: null,
  professionalId: null,
  profileImage: null, // Initialize profileImage
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;