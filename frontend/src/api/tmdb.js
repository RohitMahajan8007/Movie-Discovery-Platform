import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrending = (page = 1) =>
  tmdbApi.get(`/trending/all/day`, { params: { page } });
export const getPopularMovies = (page = 1) =>
  tmdbApi.get(`/movie/popular`, { params: { page } });
export const getPopularTvShows = (page = 1) =>
  tmdbApi.get(`/tv/popular`, { params: { page } });
export const searchMulti = (query, page = 1) =>
  tmdbApi.get(`/search/multi`, { params: { query, page } });
export const getMovieDetails = (id) =>
  tmdbApi.get(`/movie/${id}`, {
    params: { append_to_response: "videos,credits" },
  });
export const getTvDetails = (id) =>
  tmdbApi.get(`/tv/${id}`, {
    params: { append_to_response: "videos,credits" },
  });
export const getPersonDetails = (id) => tmdbApi.get(`/person/${id}`);
export const getPopularPeople = (page = 1) =>
  tmdbApi.get(`/person/popular`, { params: { page } });

export default tmdbApi;
