import { configureStore } from '@reduxjs/toolkit';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';

import createIdbStorage from '@piotr-cz/redux-persist-idb-storage';
import autoMergeLevel2 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel2';

import counterReducer from '../features/counter/counterSlice';
import settingReducer from '../features/setting/settingSlice';
import botReducer from '../features/bot/botSlice';

const storage = createIdbStorage({ name: "mh", storeName: "setting" });

const persistConfig = {
  key: "setting",
  storage: storage,
  keyPrefix: "",
  serialize: false,
  deserialize: false,
  stateReconciler: autoMergeLevel2,
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    setting: persistReducer(
      persistConfig,
      settingReducer,
    ),
    bot: persistReducer(
      {
        ...persistConfig,
        key: "bot",
      },
      botReducer,
    ),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        // just ignore every redux-firebase and react-redux-firebase action type
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
      ],
    },
    thunk: {
      extraArgument: {
      },
    },
  }),
});

export const persistor = persistStore(store);
