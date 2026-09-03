import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const submitGenerateJob = createAsyncThunk(
  'generate/submitGenerateJob',
  async (formData) => {
    const response = await axios.post(`${API_URL}/generate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
);

const initialState = {
  status: 'idle',
  jobs: [],
  currentJob: null,
  error: null,
  currentStep: 0,
};

const generateSlice = createSlice({
  name: 'generate',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetGenerate: (state) => {
      state.status = 'idle';
      state.currentJob = null;
      state.error = null;
      state.currentStep = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitGenerateJob.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentStep = 0;
      })
      .addCase(submitGenerateJob.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentJob = action.payload;
        state.currentStep = 4;
        state.jobs.unshift(action.payload);
        if (state.jobs.length > 5) {
          state.jobs = state.jobs.slice(0, 5);
        }
      })
      .addCase(submitGenerateJob.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const { setStep, resetGenerate } = generateSlice.actions;
export default generateSlice.reducer;
