'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';

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

export default function ReadList() {
  const [readlist, setReadlist] = useState<ReadlistItem[]>([]);

  useEffect(() => {
    const storedReadlist = JSON.parse(
      localStorage.getItem('mangaReadlist') || '[]'
    );
    setReadlist(storedReadlist);
  }, []);

  const toggleReadlist = (mangaId: string, imageUrl: string) => {
    setReadlist((prevReadlist) => {
      const updatedReadlist = prevReadlist.filter(
        (item) => item.id !== mangaId
      );
      localStorage.setItem('mangaReadlist', JSON.stringify(updatedReadlist));
      return updatedReadlist;
    });
  };

  return (
    <main className="flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl mb-8 font-semibold">Mes favoris</h1>
      <div className="w-full max-w-7xl">
        {readlist.length === 0 ? (
          <p className="text-center">Votre readlist est vide.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {readlist.map((manga) => {
              const displayTitle = capitalizeWords(manga.id.replace(/-/g, ' '));

              return (
                <li
                  key={manga.id}
                  className="relative flex flex-col bg-blue-950 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 group"
                >
                  <Link
                    href={`/manga/${manga.id}`}
                    className="flex flex-col h-full bg-blue-950"
                  >
                    <div className="relative w-full pt-[150%]">
                      <Image
                        src={manga.imageUrl}
                        alt={`${displayTitle} cover`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-t-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleReadlist(manga.id, manga.imageUrl);
                          }}
                          className="p-2 rounded-full bg-red-500 text-white"
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
        )}
      </div>
    </main>
  );
}
