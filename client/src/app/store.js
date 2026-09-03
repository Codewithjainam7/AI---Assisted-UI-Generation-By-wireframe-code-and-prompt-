import { configureStore } from '@reduxjs/toolkit';
import cmsReducer from '../features/cms/cmsSlice';
import generateReducer from '../features/generate/generateSlice';
export const store = configureStore({
  reducer: { cms: cmsReducer, generate: generateReducer }
});
