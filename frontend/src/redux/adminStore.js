import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const ENV_URL_API = 'http://localhost:8000/api';

const BEARER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MzI0Njk2MDUsImV4cCI6MTczMjQ3MzIwNSwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9BRE1JTiJdLCJlbWFpbCI6IlJvYmxlWm9iQHpvYi5jb20ifQ.RJ7GRvTStl4QkBbMnnw5miH-5Tnzz6Z-qhVyyt9foOQv9Me1eGu7ZMJiGmd2HRUGU2v59RtOd1fZAR6Iw1tgDlLgcOyIyqKaXslGtX5TX04itXzzUrYzwgB5onzjghYcPJffdsjyR8UZdALLBIF9AFWKQThAvo5Ze14vIE5lkgR0kVn7itLg2ePrfJQzpZTw8WoSRqX7sW4t0lvHpZwhtwUE-es9zWQpMCVh9zTeKMNbOElr3izjVhScfWVsrwFLw7R0L7G1LIhwvXk4CalO2kuPW2NuUvi3AsxB4YhDtF0DyaoU8XetowoIzum4mzAoNGVyHO_lk-GdmELuHSvNGQ';

export const fetchUnvalidatedImages = createAsyncThunk(
  'app/fetchUnvalidatedImages',
  async () => {
    const response = await fetch(`${ENV_URL_API}/images/getOnlyUnalidated`, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
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
