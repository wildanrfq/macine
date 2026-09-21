import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getCachedFilms = unstable_cache(
  async () => {
    return prisma.film.findMany({
      include: {
        showtimes: {
          orderBy: { startTime: "asc" },
        },
      },
      orderBy: [{ isNowShowing: "desc" }, { createdAt: "asc" }],
    });
  },
  ["films-all-catalog"],
  {
    revalidate: 60,
    tags: ["films"],
  }
);

export type FilmWithShowtimes = Awaited<ReturnType<typeof getCachedFilms>>[number];
