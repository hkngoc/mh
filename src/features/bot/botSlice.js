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
  },
});

export const {
  addBot,
  removeBot,
} = botSlice.actions;

export const selectBots = (state) => state.bot.bots;
export const selectBot = (id) => (state) => state.bot.bots.find(b => b.id === id);

export default botSlice.reducer;
