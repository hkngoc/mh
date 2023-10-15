import { createSlice } from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';

const initialState = {
  tab: "host",
  hosts: [{
    id: "locahost",
    host: "http://localhost",
  }],
  players: [{
    id: "player-1",
    key: "player1-xxx",
    name: "player 1",
  }, {
    id: "player-2",
    key: "player2-xxx",
    name: "player 2",
  }],
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    saveTab: (state, action) => {
      state.tab = action.payload;
    },
    addHost: (state, action) => {
      state.hosts = [
        ...state.hosts,
        {
          id: uuidv4(),
          host: action.payload,
        }
      ]
    },
    removeHost: (state, action) => {
      state.hosts = state.hosts.filter(h => h.id !== action.payload);
    },
    addPlayer: (state, action) => {
      state.players = [
        ...state.players,
        {
          id: uuidv4(),
          ...action.payload,
        }
      ]
    },
    removePlayer: (state, action) => {
      state.players = state.players.filter(h => h.id !== action.payload);
    },
  },
});

export const {
  saveTab,
  addHost,
  removeHost,
  addPlayer,
  removePlayer,
} = settingSlice.actions;

export const selectSetting = (state) => state.setting;
export const selectTab = (state) => state.setting.tab;
export const selectHost = (state) => state.setting.hosts;
export const selectPlayer = (state) => state.setting.players;

export default settingSlice.reducer;
