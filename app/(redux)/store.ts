import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import userReducer from './userSlice'; 
import prescriptionReducer from './prescriptionSlice';
import appointmentsReducer from './appointmentSlice';
import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';

// Define persistConfig
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], // Persist only the user state
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer, // Add user reducer
  prescription: prescriptionReducer,
  appointments: appointmentsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check middleware
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>(); // Export a hook that can be reused to resolve types

export default store;