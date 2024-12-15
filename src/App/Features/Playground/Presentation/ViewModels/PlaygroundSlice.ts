import { createSlice } from '@reduxjs/toolkit';
import { Box } from 'Domain/Model/Box';

export interface Workspace {
  blocks: Blocks;
}

interface Blocks {
  languageVersion: number;
  blocks: Block[];
}

interface CodeValue {
  block: Block;
}

interface Block {
  type: string;
  id: string;
  x?: number;
  y?: number;
  fields: Fields;
  next?: Next;
  inputs?: Inputs;
}

type Inputs = Record<string, string | number | CodeValue>;
type Fields = Record<string, string | number>;

interface Next {
  block: Block;
}

export type PlaygroundState = {
  error: null | string;
  boxInfo: Box | null;
  workspace?: Workspace;
};

const initialState: PlaygroundState = {
  error: null,
  boxInfo: null,
  workspace: undefined,
};

export const PlaygroundSlice = createSlice({
  name: 'playground',
  initialState: initialState,
  reducers: {
    initPlayground: (state, action) => {
      state.boxInfo = action.payload.box;
    },
    saveCode: (state, action) => {
      state.workspace = action.payload;
    },
    clearCode: (state) => {
      state.workspace = undefined;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const {
  initPlayground,
  saveCode,
  reset: resetPlayground,
  clearCode,
} = PlaygroundSlice.actions;

export const actions = PlaygroundSlice.reducer;
export default PlaygroundSlice.reducer;
