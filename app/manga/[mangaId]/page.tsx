import Image from 'next/image';
import Link from 'next/link';
import { FaBookOpen } from 'react-icons/fa';
import { getMangaData } from '../../lib/mangaData';

function formatImageTitle(str: string): string {
  if (str.toLowerCase() === 'one piece couleur') {
    return 'one-piece';
  }
  return str.toLowerCase().replace(/ /g, '-');
}

export default async function MangaPage({
  params,
}: {
  params: { mangaId: string };
}) {
  const manga = await getMangaData(params.mangaId);
  const imageTitle = formatImageTitle(manga.title);

  // Trier les chapitres par ordre décroissant
  const sortedChapters = manga.chapters.sort((a, b) => {
    return parseInt(b.number) - parseInt(a.number);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black shadow-2xl overflow-hidden rounded-lg">
        {/* Bannière */}
        <div className="relative h-80 md:h-96 rounded-lg">
          <Image
            src={`https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${imageTitle}.jpg`}
            alt={`${manga.title} cover`}
            fill
            style={{ objectFit: 'cover' }}
            className="brightness-50 rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-center px-4 mb-4 text-transparent stroke-black stroke-2 font-manga">
              {manga.title.toUpperCase()}
            </h1>

            <p className="text-xl text-white font-bold">
              {sortedChapters.length} chapitres
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6 bg-black">
          <h2 className="text-2xl font-bold text-white mb-6">Chapitres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedChapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/manga/${manga.id}/${chapter.id}`}
                className="block p-4 bg-blue rounded-lg transition hover:bg-blue group transform hover:scale-105 duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-white">
                    Ch. {chapter.number}
                  </span>
                  <FaBookOpen className="text-blue" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
