// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import cartReducer from "./slices/cartSlice";
import modalReducer from "./slices/modalSlice";
import wishlistReduer from "./slices/wishlistSlice";
import { createPersistStorage } from "@/utils/storage";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  user:userReducer,
  cart: cartReducer,
  modal: modalReducer,
  wishlist: wishlistReduer,
});
const storage = createPersistStorage();
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"],
  synchronizeTabs: true,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
