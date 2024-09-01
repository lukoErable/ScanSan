'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaTimes,
} from 'react-icons/fa';
import { MangaBasic } from './types/index';

interface MangaHistory {
  mangaTitle: string;
  chapterNumber: string;
  imageUrl: string;
  lastRead: string;
  id: string;
}

interface ReadlistItem {
  id: string;
  imageUrl: string;
}

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatImageTitle(str: string): string {
  if (str.toLowerCase() === 'one piece couleur') {
    return 'one-piece';
  }
  return str.toLowerCase().replace(/ /g, '-');
}

function formatMangaTitleForUrl(title: string): string {
  return title.toLowerCase().replace(/ /g, '-');
}

const SkeletonLoader = () => (
  <div className="animate-pulse flex-shrink-0 w-[300px] h-[175px] bg-gray-300 rounded-lg overflow-hidden" />
);

export default function Home() {
  const [mangaHistory, setMangaHistory] = useState<MangaHistory[]>([]);
  const [readlist, setReadlist] = useState<ReadlistItem[]>([]);
  const [allMangas, setAllMangas] = useState<MangaBasic[]>([]);
  const readlistRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const allMangasRef = useRef<HTMLDivElement>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingReadlist, setLoadingReadlist] = useState(true);
  const [loadingAllMangas, setLoadingAllMangas] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Charger l'historique
      const history = JSON.parse(
        localStorage.getItem('mangaReadingHistory') || '[]'
      );
      setMangaHistory(history);
      setLoadingHistory(false);

      // Charger la liste de lecture
      const storedReadlist = JSON.parse(
        localStorage.getItem('mangaReadlist') || '[]'
      );
      setReadlist(storedReadlist);
      setLoadingReadlist(false);

      // Charger tous les mangas
      await loadAllMangas();
    };

    fetchData();
  }, []);

  const loadAllMangas = async () => {
    try {
      const response = await fetch('/api/manga');
      if (!response.ok) {
        throw new Error('Failed to fetch mangas');
      }
      const mangas = await response.json();
      setAllMangas(mangas);
    } catch (error) {
      console.error('Error loading mangas:', error);
    } finally {
      setLoadingAllMangas(false);
    }
  };

  const removeMangaFromHistory = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const updatedHistory = mangaHistory.filter((_, i) => i !== index);
    setMangaHistory(updatedHistory);
    localStorage.setItem('mangaReadingHistory', JSON.stringify(updatedHistory));
  };

  const removeMangaFromReadlist = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const updatedReadlist = readlist.filter((item) => item.id !== id);
    setReadlist(updatedReadlist);
    localStorage.setItem('mangaReadlist', JSON.stringify(updatedReadlist));
  };

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    scrollOffset: number
  ) => {
    if (ref.current) {
      ref.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const handleWheel = (
    e: React.WheelEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY;
    }
  };

  const renderMangaItem = (
    manga: ReadlistItem | MangaHistory | MangaBasic,
    index: number,
    isReadlist: boolean,
    isAllMangas: boolean = false
  ) => {
    const displayTitle = capitalizeWords(
      isAllMangas
        ? (manga as MangaBasic).title
        : isReadlist
        ? manga.id
        : (manga as MangaHistory).mangaTitle
    );
    const imageTitle = formatImageTitle(
      isAllMangas
        ? (manga as MangaBasic).title
        : isReadlist
        ? manga.id
        : (manga as MangaHistory).mangaTitle
    );
    const imageUrl = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${imageTitle}.jpg`;

    const linkHref = isAllMangas
      ? `/manga/${(manga as MangaBasic).id}`
      : isReadlist
      ? `/manga/${manga.id}`
      : `/manga/${formatMangaTitleForUrl((manga as MangaHistory).mangaTitle)}/${
          'Chapter_' + (manga as MangaHistory).chapterNumber
        }`;

    return (
      <div
        key={
          isAllMangas ? (manga as MangaBasic).id : isReadlist ? manga.id : index
        }
        className="relative flex-shrink-0 w-auto h-auto border rounded-lg overflow-hidden hover:shadow-xl transition-transform duration-300 hover:scale-105 group"
      >
        <Link href={linkHref} className="block h-full">
          <div className="relative w-full h-full">
            <div className="relative w-[300px] h-[175px]">
              <Image
                src={imageUrl}
                alt={`${displayTitle} cover`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t opacity-70 from-black to-transparent group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-extrabold line-clamp-2 mb-1">
                {displayTitle.toLocaleUpperCase()}
              </h3>
              {!isReadlist && !isAllMangas && (
                <>
                  <p className="text-sm">
                    Chapitre {(manga as MangaHistory).chapterNumber}
                  </p>
                  <p className="text-xs text-green">
                    Lu le{' '}
                    {new Date(
                      (manga as MangaHistory).lastRead
                    ).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        </Link>
        {!isAllMangas && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isReadlist
                ? removeMangaFromReadlist(manga.id, e)
                : removeMangaFromHistory(index, e);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-pink text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
          >
            {isReadlist ? (
              <FaHeart className="" size={12} />
            ) : (
              <FaTimes size={12} />
            )}
          </button>
        )}
      </div>
    );
  };

  const renderSkeletons = (count: number) => (
    <div className="flex space-x-4 overflow-x-auto hide-scrollbar p-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
    </div>
  );

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="z-10 w-full max-w-7xl flex flex-col items-center justify-between font-bold text-sm">
        {loadingHistory ? (
          <>
            <h2 className="w-full text-2xl pl-2 text-blue">
              Historique de lecture
            </h2>
            {renderSkeletons(4)}
          </>
        ) : (
          mangaHistory.length > 0 && (
            <div className="w-full">
              <h2 className="text-2xl pl-2 text-blue">Historique de lecture</h2>
              <div className="relative">
                <div
                  ref={historyRef}
                  className="flex overflow-x-auto space-x-4 hide-scrollbar p-4"
                  onWheel={(e) => handleWheel(e, historyRef)}
                >
                  {mangaHistory.map((manga, index) =>
                    renderMangaItem(manga, index, false)
                  )}
                </div>
                {mangaHistory.length > 4 && (
                  <>
                    <button
                      onClick={() => scroll(historyRef, -300)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full p-2 z-10 -ml hover:bg-pink transition duration-300"
                    >
                      <FaChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => scroll(historyRef, 300)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full p-2 z-10 -mr hover:bg-pink transition duration-300"
                    >
                      <FaChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}

        {loadingReadlist ? (
          <>
            <h2 className="w-full text-2xl pl-2 text-blue">
              Mes mangas à lire
            </h2>
            {renderSkeletons(4)}
          </>
        ) : (
          readlist.length > 0 && (
            <div className="w-full">
              <Link href={'/favs'}>
                <h2 className="text-2xl pl-2 text-blue">Mes mangas à lire</h2>
              </Link>
              <div className="relative">
                <div
                  ref={readlistRef}
                  className="flex overflow-x-auto space-x-4 hide-scrollbar p-4"
                  onWheel={(e) => handleWheel(e, readlistRef)}
                >
                  {readlist.map((manga, index) =>
                    renderMangaItem(manga, index, true)
                  )}
                </div>
                {readlist.length > 4 && (
                  <>
                    <button
                      onClick={() => scroll(readlistRef, -300)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full p-2 z-10 -ml hover:bg-pink transition duration-300"
                    >
                      <FaChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => scroll(readlistRef, 300)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full p-2 z-10 mr hover:bg-pink transition duration-300"
                    >
                      <FaChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}

        {loadingAllMangas ? (
          <>
            <h2 className="w-full text-2xl pl-2 text-blue">Tous les mangas</h2>
            {renderSkeletons(4)}
          </>
        ) : (
          allMangas.length > 0 && (
            <div className="w-full">
              <Link href={'/manga'}>
                <h2 className="text-2xl pl-2 text-blue">Tous les mangas</h2>
              </Link>
              <div className="relative">
                <div
                  ref={allMangasRef}
                  className="flex overflow-x-auto space-x-4 hide-scrollbar p-4"
                  onWheel={(e) => handleWheel(e, allMangasRef)}
                >
                  {allMangas.map((manga, index) =>
                    renderMangaItem(manga, index, false, true)
                  )}
                </div>
                {allMangas.length > 4 && (
                  <>
                    <button
                      onClick={() => scroll(allMangasRef, -300)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full p-2 z-10 -ml hover:bg-pink transition duration-300"
                    >
                      <FaChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => scroll(allMangasRef, 300)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full p-2 z-10 mr hover:bg-pink transition duration-300"
                    >
                      <FaChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
