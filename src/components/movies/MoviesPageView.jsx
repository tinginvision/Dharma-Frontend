"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import { MovieSearchCombobox } from "@/components/movies/MovieSearchCombobox";
import { UpcomingReleasesSlider } from "@/components/movies/UpcomingReleasesSlider";
import { resolveUploadUrl } from "@/lib/media";
import { buildMovieList, chunkBy, movieSlug } from "@/lib/moviesLayout";

/** Same width band as four-up Past grid in `_dharma.scss` (`768px`–`1366px`). */
const PAST_GRID_FOUR_UP_MQ = "(min-width: 768px) and (max-width: 1366px)";

function usePastReleasesInitialDisplayCount() {
  /** SSR + first paint: 10 matches server; `useLayoutEffect` corrects to 8 on iPad/tablet before paint. */
  const [count, setCount] = useState(10);
  useLayoutEffect(() => {
    const mq = window.matchMedia(PAST_GRID_FOUR_UP_MQ);
    const sync = () => setCount(mq.matches ? 8 : 10);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return count;
}

/** Portrait poster card — shared size for Movies + Dharma Distribution. */
function MoviePosterCard({ item, mobile = false }) {
  const src =
    resolveUploadUrl(item.smallImage || item.recentSmall) || "/frontend/img/logo.png";
  const thumb = (
    <div className="img-pads">
      <div className="position-relative w-100 movies-past-thumb-inner">
        <Image
          src={src}
          alt={mobile ? "" : "Dharma Productions"}
          fill
          className="object-fit-cover img-responsive"
          sizes="(max-width: 767px) 207px, 19vw"
          loading="lazy"
          quality={78}
        />
      </div>
    </div>
  );
  const names = (
    <div className="movie-names">
      <h4 className={`text-up color-grey${mobile ? " small" : ""}`}>
        {item.name || ""}
        <br />({item.year})
      </h4>
    </div>
  );
  const inner = (
    <>
      {thumb}
      {names}
    </>
  );
  if (mobile) {
    return item.status ?
        <Link href={`/movie/${encodeURIComponent(movieSlug(item))}`} className="text-decoration-none">
          {inner}
        </Link>
      : inner;
  }
  return item.status ?
      <Link href={`/movie/${encodeURIComponent(movieSlug(item))}`} className="text-decoration-none">
        {inner}
      </Link>
    : inner;
}

function PosterGrid({ chunks, keyPrefix }) {
  return (
    <>
      <div className="mobile-row hidden-xs d-none d-md-block movies-past-grid-row">
        <div className="row-flex text-center flex-wrap justify-content-center">
          {chunks.flatMap((videos, ci) =>
            videos.map((item, ri) => (
              <div
                key={`${keyPrefix}-${ci}-${movieSlug(item) ?? "m"}-${String(item._id ?? item.year ?? ri)}`}
                className="col-flex px-1 mb-3"
              >
                <MoviePosterCard item={item} />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="d-md-none movies-past-mob-rail">
        {chunks.map((videos, vi) => (
          <div key={`${keyPrefix}-mob-${vi}`} className="mob-slider movies-past-mob-slider">
            <div className="movies-past-mob-strip">
              {videos.map((item) => (
                <div key={`${keyPrefix}-ms-${movieSlug(item)}`} className="movies-past-mob-slide">
                  <MoviePosterCard item={item} mobile />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function MoviesPageView({ initialDetails, searchNames, initialSearchQuery = "" }) {
  const router = useRouter();
  const [viewAllMovies, setViewAllMovies] = useState(false);
  const [viewAllDistribution, setViewAllDistribution] = useState(false);
  const [searchPick, setSearchPick] = useState(() => initialSearchQuery || "");

  useEffect(() => {
    setSearchPick(initialSearchQuery || "");
  }, [initialSearchQuery]);

  const layout = useMemo(() => buildMovieList(initialDetails), [initialDetails]);
  const initialCount = usePastReleasesInitialDisplayCount();

  const moviesDisplayed = useMemo(
    () => (layout.recentSorted ?? []).slice(0, initialCount),
    [layout.recentSorted, initialCount]
  );
  const moviesRest = useMemo(
    () => (layout.recentSorted ?? []).slice(initialCount),
    [layout.recentSorted, initialCount]
  );
  const moviesChunks = useMemo(() => chunkBy(moviesDisplayed, 5), [moviesDisplayed]);
  const moviesMoreChunks = useMemo(() => chunkBy(moviesRest, 5), [moviesRest]);

  const pastDisplayed = useMemo(
    () => (layout.pastSorted ?? []).slice(0, initialCount),
    [layout.pastSorted, initialCount]
  );
  const pastRest = useMemo(
    () => (layout.pastSorted ?? []).slice(initialCount),
    [layout.pastSorted, initialCount]
  );
  const pastChunks = useMemo(() => chunkBy(pastDisplayed, 5), [pastDisplayed]);
  const pastMoreChunks = useMemo(() => chunkBy(pastRest, 5), [pastRest]);

  const goMovie = (m) => {
    const slug = movieSlug(m);
    if (!slug || !m?.status) return;
    router.push(`/movie/${encodeURIComponent(slug)}`);
  };

  return (
    <>
      <div className="dharma-movies-bg">
        <section className="movies-page-hero">
          <div className="container">
            <div className="row">
              <div className="text-center">
                <div className="head-title movies-hero-head">
                  <h1 className="movies-hero-title-accent text-up font-hammersmith movies-head-xl mb-3">Movies</h1>
                </div>
                {searchPick ?
                  <div className="search-rslt mt-3">
                    <span className="movies-hero-title-accent">
                      Displaying Result For &apos;{searchPick}&apos;
                    </span>
                  </div>
                : null}
                <div className="search-movie dh-relative search-movie-mar mx-auto movies-hero-search-wrap">
                  <MovieSearchCombobox
                    movies={searchNames}
                    initialInputValue={initialSearchQuery}
                    parentSearchBanner={searchPick}
                    onClearBanner={() => {
                      setSearchPick("");
                      setViewAllMovies(false);
                      setViewAllDistribution(false);
                    }}
                    onSelect={(m) => {
                      setSearchPick(m.name || "");
                      goMovie(m);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {layout.upcoming.length > 0 ?
          <section className="dharma-top-pad slider-nav">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="upcoming-movie mt-4 common-class movies-upcoming-stack">
                    <div className="movies-upcoming-row movies-upcoming-row--title">
                      <div className="movies-upcoming-arrow movies-upcoming-arrow--placeholder" aria-hidden />
                      <div className="movies-upcoming-card-column">
                        <h1 className="ml15 mb0 color-primary font-hammersmith line30 f55 text-up">Upcoming Releases</h1>
                      </div>
                      <div className="movies-upcoming-arrow movies-upcoming-arrow--placeholder" aria-hidden />
                    </div>
                    <UpcomingReleasesSlider items={layout.upcoming} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        : null}
      </div>

      {(layout.recentSorted ?? []).length > 0 ?
        <section className="dharma-movies-bg2">
          <div className="orange-bg recent-movie pb-5">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="upcoming-movie">
                    <div className="title">
                      <h1 className="ml15 mb0 color-primary font-hammersmith line30 f55 text-up">Movies</h1>
                    </div>
                  </div>
                </div>
              </div>

              <PosterGrid chunks={moviesChunks} keyPrefix="movies" />

              {!viewAllMovies && moviesRest.length > 0 ?
                <div className="text-center">
                  <div className="dh-relative">
                    <div className="btn-view-more mt15 mb20 text-center">
                      <button
                        type="button"
                        className="btn-1 dh-view-all-btn font-hammersmith display-inline"
                        onClick={() => setViewAllMovies(true)}
                      >
                        <svg aria-hidden="true" focusable="false" style={{ pointerEvents: "none" }}>
                          <rect x="0" y="0" fill="none" width="100%" height="100%" />
                        </svg>
                        <span className="dh-view-all-label">VIEW ALL</span>
                      </button>
                    </div>
                  </div>
                </div>
              : null}

              {viewAllMovies ? <PosterGrid chunks={moviesMoreChunks} keyPrefix="movies-more" /> : null}
            </div>
          </div>
        </section>
      : null}

      {(layout.pastSorted ?? []).length > 0 ?
        <section className="dharma-movies-bg3">
          <div className="orange-bg recent-movie pb-5">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="upcoming-movie">
                    <div className="title">
                      <h1 className="ml15 mb0 color-primary font-hammersmith line30 f55 text-up">Dharma Distribution</h1>
                    </div>
                  </div>
                </div>
              </div>

              <PosterGrid chunks={pastChunks} keyPrefix="past" />

              {!viewAllDistribution && pastRest.length > 0 ?
                <div className="text-center">
                  <div className="dh-relative">
                    <div className="btn-view-more mt15 mb20 text-center">
                      <button
                        type="button"
                        className="btn-1 dh-view-all-btn font-hammersmith display-inline"
                        onClick={() => setViewAllDistribution(true)}
                      >
                        <svg aria-hidden="true" focusable="false" style={{ pointerEvents: "none" }}>
                          <rect x="0" y="0" fill="none" width="100%" height="100%" />
                        </svg>
                        <span className="dh-view-all-label">VIEW ALL</span>
                      </button>
                    </div>
                  </div>
                </div>
              : null}

              {viewAllDistribution ? <PosterGrid chunks={pastMoreChunks} keyPrefix="past-more" /> : null}
            </div>
          </div>
        </section>
      : null}
    </>
  );
}
