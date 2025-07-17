import axios from "axios";
import type { Movie } from "../types/movie";

const myKey = import.meta.env.VITE_TMDB_TOKEN;
const URL = "https://api.themoviedb.org/3/search/movie";

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export default async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const options = {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  };
  const response = await axios.get<MoviesResponse>(URL, options);
  console.log(response.data);
  return response.data;
}
