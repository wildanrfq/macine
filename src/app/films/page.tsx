import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import FilmCatalogView from "@/components/public/FilmCatalogView";
import { getCachedFilms } from "@/lib/films";

export const revalidate = 60;

interface FilmsPageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const sp = searchParams ? await searchParams : {};
  const initialCategory = sp.category?.toUpperCase() || "ALL";
  const films = await getCachedFilms();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <FilmCatalogView
          initialFilms={films}
          initialCategory={initialCategory}
        />
      </main>

      <Footer />
    </div>
  );
}
