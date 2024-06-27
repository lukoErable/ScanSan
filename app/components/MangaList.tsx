'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { MangaBasic } from '../types/index';

interface MangaListProps {
  mangas: MangaBasic[];
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

export default function MangaList({ mangas }: MangaListProps) {
  const [readlist, setReadlist] = useState<ReadlistItem[]>([]);

  useEffect(() => {
    const storedReadlist = localStorage.getItem('mangaReadlist');
    if (storedReadlist) {
      setReadlist(JSON.parse(storedReadlist));
    }
  }, []);

  const toggleReadlist = (mangaId: string, imageUrl: string) => {
    setReadlist((prevReadlist) => {
      const isInReadlist = prevReadlist.some((item) => item.id === mangaId);
      let updatedReadlist;

      if (isInReadlist) {
        updatedReadlist = prevReadlist.filter((item) => item.id !== mangaId);
      } else {
        updatedReadlist = [...prevReadlist, { id: mangaId, imageUrl }];
      }

      localStorage.setItem('mangaReadlist', JSON.stringify(updatedReadlist));
      return updatedReadlist;
    });
  };

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {mangas.map((manga) => {
            const displayTitle = capitalizeWords(manga.title);
            const imageTitle = formatImageTitle(manga.title);
            const imageUrl = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${imageTitle}.jpg`;
            const isInReadlist = readlist.some((item) => item.id === manga.id);

            return (
              <li
                key={manga.id}
                className="relative flex flex-col bg-blue rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group"
              >
                <Link
                  href={`/manga/${manga.id}`}
                  className="flex flex-col h-full bg-blue"
                >
                  <div className="relative w-full pt-[150%]">
                    <Image
                      src={imageUrl}
                      alt={`${displayTitle} cover`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleReadlist(manga.id, imageUrl);
                        }}
                        className={`p-2 rounded-full ${
                          isInReadlist ? 'bg-pink' : 'bg-green'
                        } text-white`}
                      >
                        <FaHeart size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex items-center justify-center transition-colors duration-300">
                    <h3 className="text-white text-center text-sm font-medium line-clamp-2">
                      {displayTitle}
                    </h3>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
