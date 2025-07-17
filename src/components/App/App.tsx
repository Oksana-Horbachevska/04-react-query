import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import fetchMovies from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => {
      return fetchMovies(query, page);
    },
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  useEffect(() => {
    if (query !== "" && data && data.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [data, query]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {data && data.results.length > 0 && (
        <MovieGrid onSelect={handleSelectMovie} movies={data.results} />
      )}

      <Toaster />
      {selectedMovie && (
        <MovieModal
          onClose={() => setSelectedMovie(null)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}
