import { createSlice } from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';

const initialState = {
  bots: [],
};

export const botSlice = createSlice({
  name: 'bot',
  initialState,
  reducers: {
    addBot: (state, action) => {
      state.bots = [
        ...state.bots,
        {
          id: uuidv4(),
          ...action.payload,
        }
      ]
    },
    removeBot: (state, action) => {
      state.bots = state.bots.filter(b => b.id !== action.payload);
    },
    saveMap: (state, action) => {
      const { id, map } = action.payload;

      const index = state.bots.findIndex(b => b.id === id);

      if (index >= 0) {
        state.bots[index].map = map;
      }
    },
    cleanMap: (state, action) => {
      const { id } = action.payload;

      const index = state.bots.findIndex(b => b.id === id);

      if (index >= 0) {
        state.bots[index].map = null;
      }
    },
  },
});

export const {
  addBot,
  removeBot,
  saveMap,
  cleanMap,
} = botSlice.actions;

export const selectBots = (state) => state.bot.bots;
export const selectBot = (id) => (state) => state.bot.bots.find(b => b.id === id);

export default botSlice.reducer;
