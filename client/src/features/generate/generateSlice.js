import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchElementsByIds } from '../cms/cmsSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const submitGenerateJob = createAsyncThunk(
  'generate/submitGenerateJob',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      // Animate progress steps
      const timer1 = setTimeout(() => dispatch(setStep(1)), 800);
      const timer2 = setTimeout(() => dispatch(setStep(2)), 2000);
      const timer3 = setTimeout(() => dispatch(setStep(3)), 4000);

      const response = await axios.post(`${API_URL}/generate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (response.data?.ok && response.data?.elementIds) {
        dispatch(fetchElementsByIds({
          elementIds: response.data.elementIds,
          pageName: response.data.pageName || 'Home'
        }));
      }

      return response.data;
    } catch (err) {
      const message = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Generation failed';
      return rejectWithValue(message);
    }
  }
);

function getSavedJobs() {
  try {
    const raw = localStorage.getItem('uigen_jobs');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

const savedJobs = getSavedJobs();

const initialState = {
  status: 'idle',
  jobs: savedJobs,
  currentJob: savedJobs[0] || null,
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
    },
    clearHistory: (state) => {
      state.jobs = [];
      state.currentJob = null;
      state.status = 'idle';
      state.error = null;
      state.currentStep = 0;
      try {
        localStorage.removeItem('uigen_jobs');
      } catch (e) {}
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
        if (state.jobs.length > 10) {
          state.jobs = state.jobs.slice(0, 10);
        }
        try {
          localStorage.setItem('uigen_jobs', JSON.stringify(state.jobs));
        } catch (e) {}
      })
      .addCase(submitGenerateJob.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || action.error.message || 'Generation failed';
        state.currentStep = 0;
      });
  },
});

export const { setStep, resetGenerate, clearHistory } = generateSlice.actions;
export default generateSlice.reducer;
