import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrending } from "../../api/tmdb";

export const fetchTrending = createAsyncThunk(
  "movies/fetchTrending",
  async (page, thunkAPI) => {
    try {
      const res = await getTrending(page);
      return { results: res.data.results, page };
    } catch (err) {
      console.error("TMDB API Error:", err);
      return thunkAPI.rejectWithValue("Failed to fetch trending");
    }
  },
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    trending: [],
    status: "idle",
    page: 1,
    hasMore: true,
  },
  reducers: {
    resetTrending(state) {
      state.trending = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.page === 1) {
          state.trending = action.payload.results;
        } else {
          // avoid duplicates
          const newItems = action.payload.results.filter(
            (item) =>
              !state.trending.some((existing) => existing.id === item.id),
          );
          state.trending = [...state.trending, ...newItems];
        }
        state.page = action.payload.page;
        if (action.payload.results.length === 0) state.hasMore = false;
      })
      .addCase(fetchTrending.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { resetTrending } = movieSlice.actions;
export default movieSlice.reducer;
