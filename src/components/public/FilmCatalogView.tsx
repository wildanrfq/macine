"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { FilmWithShowtimes } from "@/lib/films";
import { getFilmPalette } from "@/lib/film-palettes";

interface FilmCatalogViewProps {
  initialFilms: FilmWithShowtimes[];
  initialCategory?: string;
}

const CATEGORIES = [
  { key: "ALL", label: "Semua Program", desc: "Seluruh kurasi film" },
  { key: "FEATURE", label: "Film Panjang", desc: "Sinema Sorot" },
  { key: "DOCUMENTARY", label: "Dokumenter", desc: "Rekam Jejak" },
  { key: "SHORT", label: "Film Pendek", desc: "Kisah Singkat" },
] as const;

export default function FilmCatalogView({
  initialFilms,
  initialCategory = "ALL",
}: FilmCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category")?.toUpperCase() || "ALL";
      setSelectedCategory(cat);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectCategory = (catKey: string) => {
    startTransition(() => {
      setSelectedCategory(catKey);
    });

    const newUrl = catKey === "ALL" ? "/films" : `/films?category=${catKey}`;
    window.history.replaceState(null, "", newUrl);
  };

  const filteredFilms = initialFilms.filter((film) => {
    if (selectedCategory === "ALL") return true;
    return film.category === selectedCategory;
  });

  const nowShowing = filteredFilms.filter((f) => f.isNowShowing);
  const comingSoon = filteredFilms.filter((f) => f.isComingSoon);

  const getCategoryCount = (key: string) => {
    if (key === "ALL") return initialFilms.length;
    return initialFilms.filter((f) => f.category === key).length;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-reel">
            Kurasi Sinema
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Katalog Film & Jadwal
        </h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-reel font-sans">
          Pilihan sinema independen dari film panjang, film dokumenter bersejarah, hingga film pendek terbaik. Diputar intim di auditorium berkapasitas 20–24 kursi.
        </p>

        {/* Instant Category Filter Tabs */}
        <div className="mt-6 sm:mt-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            const count = getCategoryCount(cat.key);

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleSelectCategory(cat.key)}
                className={`group flex flex-shrink-0 items-center gap-2 rounded-xs border px-3.5 sm:px-4 py-2 font-mono text-xs font-medium whitespace-nowrap cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? "border-ink bg-ink text-paper shadow-xs"
                    : "border-line bg-paper-card text-ink hover:border-ink/50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] hidden sm:inline ${
                    isActive ? "text-paper/70" : "text-reel group-hover:text-ink"
                  }`}
                >
                  ({cat.desc})
                </span>
                <span
                  className={`ml-0.5 rounded-xs px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                    isActive
                      ? "bg-paper/20 text-paper"
                      : "bg-paper-warm text-reel group-hover:text-ink"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Now Showing Section */}
      <section className="mt-10 sm:mt-12">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="font-display text-2xl font-bold text-ink">
              Sedang Tayang
            </h2>
            <span className="font-mono text-xs text-reel">
              ({nowShowing.length} Judul)
            </span>
          </div>
          {selectedCategory !== "ALL" && (
            <button
              type="button"
              onClick={() => handleSelectCategory("ALL")}
              className="font-mono text-xs text-reel hover:text-ink underline underline-offset-4 cursor-pointer transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>

        {nowShowing.length === 0 ? (
          <div className="mt-8 border border-dashed border-line bg-paper-card p-10 sm:p-12 text-center shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
            <p className="text-sm font-mono text-reel">
              Belum ada film yang sedang tayang untuk kategori ini.
            </p>
            <button
              type="button"
              onClick={() => handleSelectCategory("ALL")}
              className="mt-4 inline-block font-mono text-xs font-semibold text-ink underline underline-offset-4 hover:text-reel cursor-pointer"
            >
              Lihat Semua Program Film
            </button>
          </div>
        ) : (
          <div
            key={selectedCategory}
            className="animate-film-fade-in mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {nowShowing.map((film) => {
              const palette = getFilmPalette(film.slug || film.id);
              const programLabel =
                film.category === "DOCUMENTARY"
                  ? "Rekam Jejak"
                  : film.category === "SHORT"
                  ? "Kisah Singkat"
                  : "Sinema Sorot";

              return (
                <article
                  key={film.id}
                  className="flex flex-col border border-line bg-paper-card p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink rounded-none border border-line/60">
                    <Image
                      src={film.posterUrl}
                      alt={film.title}
                      width={360}
                      height={540}
                      unoptimized
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between pt-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-ink/75">
                        <span className="border border-line bg-transparent px-2 py-0.5 tracking-tight">
                          {programLabel} Vol. {film.programVol}
                        </span>
                        <span className="text-reel font-mono">{film.durationMinutes} Menit</span>
                      </div>

                      <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                        <Link
                          href={`/films/${film.slug}`}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {film.title}
                        </Link>
                      </h3>

                      {film.originalTitle && (
                        <p className="mt-0.5 font-display text-xs italic text-reel">
                          {film.originalTitle} ({film.releaseYear})
                        </p>
                      )}

                      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-reel font-sans">
                        {film.synopsis}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-line pt-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="block font-mono text-[11px] text-reel uppercase tracking-wider">
                            Tarif
                          </span>
                          <div className="font-mono text-sm font-bold text-ink">
                            <span>Rp {film.price.toLocaleString("id-ID")}</span>
                            <span className="text-[10px] text-reel font-normal font-sans ml-1">/ kursi</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/films/${film.slug}`}
                            className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink hover:text-ink"
                          >
                            Detail
                          </Link>

                          {film.showtimes.length > 0 && (
                            <Link
                              href={`/book/${film.showtimes[0].id}`}
                              className="rounded-md px-3.5 py-1.5 font-mono text-xs font-medium transition-opacity hover:opacity-90 shadow-xs"
                              style={{
                                backgroundColor: palette.accent,
                                color: palette.accentText,
                              }}
                            >
                              Pesan Tiket
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Showtimes badges */}
                      {film.showtimes.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line/60 pt-2.5">
                          <span className="font-mono text-[11px] text-reel uppercase tracking-wider">
                            Jadwal:
                          </span>
                          {film.showtimes.map((st) => (
                            <Link
                              key={st.id}
                              href={`/book/${st.id}`}
                              className="rounded-xs border border-line bg-paper px-2 py-0.5 font-mono text-xs font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                            >
                              {new Date(st.startTime).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section className="mt-16 border-t border-line pt-12">
          <div className="border-b border-line pb-3">
            <h2 className="font-display text-2xl font-bold text-ink">
              Segera Hadir
            </h2>
            <p className="mt-1 font-sans text-xs text-reel">
              Rilisan eksklusif dan film retrospektif mendatang ({comingSoon.length} Judul)
            </p>
          </div>

          <div
            key={`coming-soon-${selectedCategory}`}
            className="animate-film-fade-in mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {comingSoon.map((film) => (
              <article
                key={film.id}
                className="border border-line bg-paper-card p-4 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-ink rounded-none border border-line/60">
                  <Image
                    src={film.posterUrl}
                    alt={film.title}
                    width={360}
                    height={540}
                    unoptimized
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <span className="border border-line bg-transparent px-2 py-0.5 font-mono text-[11px] text-reel uppercase tracking-tight">
                    {film.genre}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold text-ink">
                    <Link href={`/films/${film.slug}`} className="hover:opacity-80 transition-opacity">
                      {film.title}
                    </Link>
                  </h3>
                  <p className="mt-1 font-mono text-xs text-reel">
                    Sutradara: {film.director}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-reel font-sans">
                    {film.synopsis}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
