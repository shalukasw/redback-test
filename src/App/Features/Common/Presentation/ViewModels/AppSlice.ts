import { createSlice } from '@reduxjs/toolkit';

import { IUser } from 'Domain/Model/User';

export type AppState = {
  current: 'LoggedOff' | 'LoggedIn';
  user: IUser | null;
};

const initialState: AppState = {
  user: null,
  current: 'LoggedOff',
};

export const AppSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    coderJoined: (state, action) => {
      state.current = 'LoggedIn';
      state.user = action.payload;
    },
    authStateChange: (state) => {
      state.current = 'LoggedOff';
    },
  },
});

export const { authStateChange, coderJoined } = AppSlice.actions;

export default AppSlice.reducer;
