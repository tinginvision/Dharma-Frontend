"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveUploadUrl } from "@/lib/media";
import { movieSearchThumbnail, movieSlug } from "@/lib/moviesLayout";

const FALLBACK_POSTER = "/frontend/img/logo.png";
const LIST_CAP = 200;
/** Dropdown shows this many titles first; scrolling (or arrows) reveals the next batch. */
const DROPDOWN_CHUNK = 3;

function ceilChunkForIndex(zeroBasedIndex, chunk, len) {
  const needRows = zeroBasedIndex + 1;
  const chunks = Math.ceil(needRows / chunk);
  return Math.min(len, chunks * chunk);
}

export function MovieSearchCombobox({
  movies,
  onSelect,
  parentSearchBanner,
  onClearBanner,
  initialInputValue = "",
  variant = "default",
  placeholder = "Search for a Movie",
  autoFocus = false,
  loading = false,
}) {
  const isHeader = variant === "header";
  const [query, setQuery] = useState(initialInputValue);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [visibleCount, setVisibleCount] = useState(DROPDOWN_CHUNK);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = isHeader ? "movies-header-search-listbox" : "movies-search-listbox";

  useEffect(() => {
    setQuery(initialInputValue || "");
  }, [initialInputValue]);

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  useEffect(() => {
    if (!parentSearchBanner) setQuery("");
  }, [parentSearchBanner]);

  const sortedSource = useMemo(() => {
    return [...movies]
      .filter((m) => m.status)
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }));
  }, [movies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedSource.slice(0, LIST_CAP);
    return sortedSource
      .filter((m) => (m.name || "").toLowerCase().includes(q))
      .slice(0, LIST_CAP);
  }, [sortedSource, query]);

  useEffect(() => {
    setHighlighted(0);
    if (!isHeader) {
      setVisibleCount(Math.min(DROPDOWN_CHUNK, filtered.length));
    }
  }, [query, open, filtered.length, isHeader]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.querySelector(`[data-movies-search-index="${highlighted}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open, visibleCount]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  const pick = useCallback(
    (m) => {
      setQuery("");
      setOpen(false);
      onSelect(m);
    },
    [onSelect]
  );

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp") && filtered.length) {
      setOpen(true);
      return;
    }
    if (!filtered.length) {
      if (e.key === "Escape") close();
      return;
    }

    const len = filtered.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => {
        const next = Math.min(i + 1, len - 1);
        if (!isHeader) {
          setVisibleCount((v) => Math.max(v, ceilChunkForIndex(next, DROPDOWN_CHUNK, len)));
        }
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const m = filtered[highlighted];
      if (m) pick(m);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
      inputRef.current?.blur();
    }
  };

  const onDropdownScroll = useCallback(
    (ev) => {
      const el = ev.currentTarget;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 36;
      if (!nearBottom) return;
      setVisibleCount((v) => (v >= filtered.length ? v : Math.min(v + DROPDOWN_CHUNK, filtered.length)));
    },
    [filtered.length]
  );

  const displayed = isHeader ? filtered : filtered.slice(0, visibleCount);
  const showList = open && !loading && displayed.length > 0;
  const remaining = isHeader ? 0 : filtered.length - visibleCount;
  const inputId = isHeader ? "movies-header-search-input" : "movies-search-input";

  return (
    <div
      ref={containerRef}
      className={`movies-search-combobox text-start${isHeader ? " movies-search-combobox--header search-drop" : ""}`}
    >
      <div
        className={`movies-search-field dh-relative${parentSearchBanner ? " movies-search-field--has-clear" : ""}`}
      >
        <label htmlFor={inputId} className="visually-hidden">
          {placeholder}
        </label>
        <div className="movies-search-input-inner dh-relative">
          <img
            src="/frontend/img/search-grey.png"
            alt=""
            className={`movies-search-input-icon${isHeader ? " movies-search-input-icon--header" : ""}`}
            width={22}
            height={22}
          />
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-busy={loading}
            className={
              isHeader ?
                "movies-search-input search-in form-control rounded-0 shadow-none"
              : "movies-search-input form-control shadow-none"
            }
            placeholder={placeholder}
            value={query}
            onChange={(ev) => {
              setQuery(ev.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
        </div>
        {parentSearchBanner && onClearBanner ?
          <button
            type="button"
            className="movies-search-clear btn btn-link p-0 border-0 bg-transparent"
            aria-label="Clear search"
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => {
              onClearBanner();
              setQuery("");
              close();
            }}
          >
            <img src="/frontend/img/error-2.png" alt="" width={24} height={24} />
          </button>
        : null}
      </div>

      {showList ?
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={`Movie matches (${filtered.length})`}
          className={
            isHeader ?
              "movies-search-dropdown movies-search-dropdown--header"
            : "movies-search-dropdown movies-search-dropdown--paginated"
          }
          onScroll={isHeader ? undefined : onDropdownScroll}
        >
          {displayed.map((m, i) => {
            const slug = movieSlug(m);
            const thumb = resolveUploadUrl(movieSearchThumbnail(m)) || FALLBACK_POSTER;
            const label = `${m.name || ""}${m.year ? ` (${m.year})` : ""}`;
            const active = i === highlighted;
            return (
              <li
                key={slug || String(m._id)}
                data-movies-search-index={i}
                role="option"
                aria-posinset={i + 1}
                aria-setsize={filtered.length}
                aria-selected={active}
                className={`movies-search-option${isHeader ? " movi-src-rslt" : ""} ${active ? "is-highlighted" : ""}`}
                onMouseEnter={() => setHighlighted(i)}
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => pick(m)}
              >
                {isHeader ?
                  <>
                    <span className="display-inline w60">
                      <img src={thumb} alt="" className="movies-search-thumb" />
                    </span>
                    <span className="movies-search-option-label display-inline ml15">{label}</span>
                  </>
                : <>
                    <img src={thumb} alt="" className="movies-search-thumb" />
                    <span className="movies-search-option-label">{label}</span>
                  </>
                }
              </li>
            );
          })}
          {remaining > 0 ?
            <li className="movies-search-scroll-hint" role="presentation" aria-hidden>
              <span className="small movies-search-scroll-hint-inner d-block">
                Scroll for more — {remaining} more
              </span>
            </li>
          : null}
        </ul>
      : null}
    </div>
  );
}
