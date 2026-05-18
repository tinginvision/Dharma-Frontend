"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MovieSearchCombobox } from "@/components/movies/MovieSearchCombobox";
import { movieSlug } from "@/lib/moviesLayout";

/**
 * Legacy `header.html` movie ui-select — autocomplete with posters, navigate to `/movie/[slug]`.
 */
export function HeaderMovieSearch({ onClose }) {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/movies/names", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setMovies(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const goMovie = (m) => {
    const slug = movieSlug(m);
    if (!slug || !m?.status) return;
    onClose();
    router.push(`/movie/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="movie-search-pg dh-relative dh-header-search-field-wrap w-100">
      <MovieSearchCombobox
        variant="header"
        movies={movies}
        loading={loading}
        placeholder="Search for movie"
        autoFocus
        onSelect={goMovie}
      />
      <button
        type="button"
        className="search-img2 border-0 bg-transparent p-0"
        onClick={onClose}
        aria-label="Close search"
      >
        <Image src="/frontend/img/error-2.png" alt="" width={24} height={24} />
      </button>
    </div>
  );
}
