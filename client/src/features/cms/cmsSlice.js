import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const fetchElementsByIds = createAsyncThunk(
  'cms/fetchElementsByIds',
  async ({ elementIds, pageName }) => {
    const response = await axios.get(`${API_URL}/elements`, { params: { pageName } });
    const elements = response.data?.elements || response.data || [];
    return { elements: Array.isArray(elements) ? elements : [], pageName };
  }
);

export const patchElement = createAsyncThunk(
  'cms/patchElement',
  async ({ fieldId, pageName, content, css }) => {
    const payload = {};
    if (content !== undefined) payload.content = content;
    if (css !== undefined) payload.css = css;
    const response = await axios.patch(`${API_URL}/elements/${fieldId}`, payload);
    const element = response.data?.element || response.data;
    return { fieldId, pageName, element };
  }
);

const initialState = {
  allSections: {},
  allSectionsCss: {},
  sectionNames: {},
  loading: false,
  error: null,
};

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    updateLiveCmsValue: (state, action) => {
      const { fieldId, pageName, value } = action.payload;
      if (!state.allSections[pageName]) state.allSections[pageName] = {};
      state.allSections[pageName][fieldId] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchElementsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElementsByIds.fulfilled, (state, action) => {
        state.loading = false;
        const { elements, pageName } = action.payload;
        if (!state.allSections[pageName]) state.allSections[pageName] = {};
        if (!state.allSectionsCss[pageName]) state.allSectionsCss[pageName] = {};
        
        elements.forEach(el => {
          state.allSections[pageName][el.fieldId] = el.contentType === 'Cards' ? el.loop : el.content;
          if (el.contentType === 'Cards' && Array.isArray(el.loop)) {
            el.loop.forEach(item => {
              if (item.fieldId1) state.allSections[pageName][item.fieldId1] = item.field1;
              if (item.fieldId2) state.allSections[pageName][item.fieldId2] = item.field2;
            });
          }
          if (el.css) {
            state.allSectionsCss[pageName][el.fieldId] = el.css;
          }
          if (el.sectionId && el.sectionName) {
            state.sectionNames[el.sectionId] = el.sectionName;
          }
        });
      })
      .addCase(fetchElementsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(patchElement.fulfilled, (state, action) => {
        const { fieldId, pageName, element } = action.payload;
        if (!element) return;
        if (!state.allSections[pageName]) state.allSections[pageName] = {};
        if (!state.allSectionsCss[pageName]) state.allSectionsCss[pageName] = {};
        
        state.allSections[pageName][fieldId] = (element.contentType === 'Cards' && Array.isArray(element.loop) && element.loop.length > 0)
          ? element.loop
          : (element.content || element.loop);

        if (element.contentType === 'Cards' && Array.isArray(element.loop)) {
          element.loop.forEach(item => {
            if (item.fieldId1) state.allSections[pageName][item.fieldId1] = item.field1;
            if (item.fieldId2) state.allSections[pageName][item.fieldId2] = item.field2;
          });
        }
        if (element.css) {
          state.allSectionsCss[pageName][fieldId] = element.css;
        }
      });
  },
});

export const { updateLiveCmsValue } = cmsSlice.actions;
export default cmsSlice.reducer;
