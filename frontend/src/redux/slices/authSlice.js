import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/backend";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.error || "Login failed",
      );
    }
  },
);

export const fetchFavorites = createAsyncThunk(
  "auth/fetchFavorites",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/users/favorites");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch favorites");
    }
  },
);

export const toggleFavorite = createAsyncThunk(
  "auth/toggleFavorite",
  async ({ action, tmdbId, title, posterPath }, thunkAPI) => {
    try {
      const res = await api.post("/users/favorites", {
        action,
        tmdbId,
        title,
        posterPath,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to toggle favorite");
    }
  },
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  favorites: [],
  history: [],
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.favorites = [];
      state.history = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
