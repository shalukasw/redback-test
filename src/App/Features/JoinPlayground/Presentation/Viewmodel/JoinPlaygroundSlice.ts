import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';

import repo from '../../Repository/JoinPlaygroundRespository';
import { IGuestCoder } from 'Domain/Model/User';
export type JoinPlaygroundState = {
  current:
    | 'Uninitialized'
    | 'NoName'
    | 'userNameVerify'
    | 'UserNameVerified'
    | 'UserNameLoaded'
    | 'UserNameRegenerated'
    | 'CoderSelected';
  status: 'loading' | 'active' | 'error';
  generatedCoder: IGuestCoder | null;
  error: string | null;
};

const initialState: JoinPlaygroundState = {
  current: 'Uninitialized',
  status: 'loading',
  generatedCoder: null,
  error: null,
};

export const JoinPlaygroundSlice = createSlice({
  name: 'joinplayground',
  initialState: initialState,
  reducers: {
    promptGenerateName: (state) => {
      state.current = 'NoName';
      state.status = 'active';
      state.error = null;
      state.generatedCoder = null;
    },
    loadCoderName: (state, action) => {
      // Load existing user from Store
      state.current = 'UserNameLoaded';
      state.generatedCoder = action.payload.guestUserInfo;
      state.status = 'active';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(generateCoderName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateCoderName.fulfilled, (state, action) => {
        if (state.current === 'NoName') {
          state.current = 'userNameVerify';
        } else {
          state.current = 'UserNameRegenerated';
        }
        state.status = 'active';
        state.error = null;
        state.generatedCoder = action.payload.coder;
      })
      .addCase(generateCoderName.rejected, (state) => {
        state.status = 'active';
        state.error = i18next.t('join.error.creatingName');
      })
      .addCase(joinWithName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(joinWithName.fulfilled, (state) => {
        state.status = 'active';
        state.current = 'CoderSelected';
      })
      .addCase(joinWithName.rejected, (state) => {
        state.status = 'active'; // todo
        state.error = i18next.t('join.error.joining');
      });
  },
});

export const generateCoderName = createAsyncThunk(
  'joinplayground/generateName',
  () => {
    return repo.generateNewName();
  },
);

// todo: move to playground init?
export const joinWithName = createAsyncThunk(
  'joinplayground/joinWithName',
  (req: { coder: IGuestCoder; userId: string | undefined }) => {
    return repo.joinWithCodername(req.coder.name, req.userId);
  },
);

export const { promptGenerateName, loadCoderName } =
  JoinPlaygroundSlice.actions;

export default JoinPlaygroundSlice.reducer;
