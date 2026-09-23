export interface FilmPalette {
  accent: string;
  accentHover: string;
  accentText: string;
  subtleTint: string;
  accentBorder: string;
}

export const FILM_PALETTES: Record<string, FilmPalette> = {
  // Drive My Car: Yusuke Kafuku's iconic 1989 Saab 900 Turbo Red
  "drive-my-car": {
    accent: "#B8281E",
    accentHover: "#9D1F16",
    accentText: "#FFFFFF",
    subtleTint: "rgba(184, 40, 30, 0.08)",
    accentBorder: "rgba(184, 40, 30, 0.4)",
  },
  // Like Father, Like Son: Hirokazu Kore-eda's architectural slate navy
  "like-father-like-son": {
    accent: "#2B4C6F",
    accentHover: "#1E3752",
    accentText: "#FFFFFF",
    subtleTint: "rgba(43, 76, 111, 0.08)",
    accentBorder: "rgba(43, 76, 111, 0.4)",
  },
  // Aftersun: Charlotte Wells' nostalgic Mediterranean azure and twilight
  "aftersun": {
    accent: "#1E758B",
    accentHover: "#165A6B",
    accentText: "#FFFFFF",
    subtleTint: "rgba(30, 117, 139, 0.08)",
    accentBorder: "rgba(30, 117, 139, 0.4)",
  },
  // Eksil: Cold-war European winter coats and deep mahogany lacquer
  "eksil": {
    accent: "#7E3230",
    accentHover: "#652624",
    accentText: "#FFFFFF",
    subtleTint: "rgba(126, 50, 48, 0.08)",
    accentBorder: "rgba(126, 50, 48, 0.4)",
  },
  // Lemantun: Aged teakwood sepia and vintage family heirloom amber
  "lemantun": {
    accent: "#9A5A1C",
    accentHover: "#7E4815",
    accentText: "#FFFFFF",
    subtleTint: "rgba(154, 90, 28, 0.08)",
    accentBorder: "rgba(154, 90, 28, 0.4)",
  },
  // The Look of Silence: Somber optometry trial frames and dark olive earth
  "the-look-of-silence": {
    accent: "#7A6624",
    accentHover: "#61511B",
    accentText: "#FFFFFF",
    subtleTint: "rgba(122, 102, 36, 0.08)",
    accentBorder: "rgba(122, 102, 36, 0.4)",
  },
  // Tilik: Open truck tarp and asphalt across rural Bantul
  "tilik": {
    accent: "#3A6044",
    accentHover: "#2D4B35",
    accentText: "#FFFFFF",
    subtleTint: "rgba(58, 96, 68, 0.08)",
    accentBorder: "rgba(58, 96, 68, 0.4)",
  },
};

const DEFAULT_PALETTE: FilmPalette = {
  accent: "#B8281E",
  accentHover: "#9D1F16",
  accentText: "#FFFFFF",
  subtleTint: "rgba(184, 40, 30, 0.08)",
  accentBorder: "rgba(184, 40, 30, 0.4)",
};

export function getFilmPalette(slugOrId?: string): FilmPalette {
  if (!slugOrId) return DEFAULT_PALETTE;
  return FILM_PALETTES[slugOrId] || DEFAULT_PALETTE;
}
