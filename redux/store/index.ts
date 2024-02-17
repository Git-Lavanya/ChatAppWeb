import { configureStore } from "@reduxjs/toolkit";
import commonReducers from "../reducers/index";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig: import("redux-persist").PersistConfig<RootState> = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, commonReducers);

let store = configureStore({
  reducer: commonReducers,
});
if (typeof window !== "undefined") {
  store = configureStore({
    reducer: persistedReducer,
  });
}
const persistedStore = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export { persistedStore, store };
