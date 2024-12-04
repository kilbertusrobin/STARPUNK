import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getCookie from '../services/getCookie';

const ENV_URL_API = 'http://localhost:8000/api';

export const fetchUnvalidatedImages = createAsyncThunk(
  'app/fetchUnvalidatedImages',
  async () => {
    const token = getCookie('token');
    if (!token) {
      throw new Error('Token introuvable dans les cookies');
    }
    const response = await fetch(`${ENV_URL_API}/images/getOnlyUnalidated`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    const data = await response.json();
    return data;
  }
);


const appSlice = createSlice({
  name: 'app',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnvalidatedImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnvalidatedImages.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUnvalidatedImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export default store;
