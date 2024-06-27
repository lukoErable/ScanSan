'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import ImageViewer from '../../../components/ImageViewer';
import { Chapter, MangaBasic } from '../../../types/index';

function formatImageTitle(str: string): string {
  if (str.toLowerCase() === 'one piece couleur') {
    return 'one-piece';
  }
  return str.toLowerCase().replace(/ /g, '-');
}

function useReadingHistory() {
  const addToHistory = useCallback(
    (mangaTitle: string, chapterNumber: string, imageUrl: string) => {
      if (typeof window !== 'undefined') {
        const history = JSON.parse(
          localStorage.getItem('mangaReadingHistory') || '[]'
        );
        const newEntry = {
          mangaTitle,
          chapterNumber,
          imageUrl,
          lastRead: new Date().toISOString(),
        };

        const existingIndex = history.findIndex(
          (item: any) => item.mangaTitle === mangaTitle
        );
        if (existingIndex !== -1) {
          history[existingIndex] = newEntry;
        } else {
          history.push(newEntry);
        }

        history.sort(
          (a: any, b: any) =>
            new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
        );
        const limitedHistory = history.slice(0, 20);

        localStorage.setItem(
          'mangaReadingHistory',
          JSON.stringify(limitedHistory)
        );
      }
    },
    []
  );

  return { addToHistory };
}

const preloadNextChapter = async (mangaId: string, nextChapterId: string) => {
  try {
    await fetch(`/api/manga?mangaId=${mangaId}&chapterId=${nextChapterId}`);
  } catch (error) {
    console.error('Error preloading next chapter:', error);
  }
};

export default function ChapterPage({
  params,
}: {
  params: { mangaId: string; chapterId: string };
}) {
  const [chapterData, setChapterData] = useState<{
    chapter: Chapter;
    prevChapter: MangaBasic | null;
    nextChapter: MangaBasic | null;
  } | null>(null);
  const { addToHistory } = useReadingHistory();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/manga?mangaId=${params.mangaId}&chapterId=${params.chapterId}`
      );
      const data = await response.json();
      setChapterData(data);
      const imageTitle = formatImageTitle(data.chapter.mangaTitle);
      const imageUrl = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${imageTitle}.jpg`;
      addToHistory(data.chapter.mangaTitle, data.chapter.number, imageUrl);
      if (data.nextChapter) {
        preloadNextChapter(params.mangaId, data.nextChapter.id);
      }
    } catch (error) {
      console.error('Error fetching chapter data:', error);
    }
  }, [params.mangaId, params.chapterId, addToHistory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!chapterData) return <div>Loading...</div>;

  const { chapter, prevChapter, nextChapter } = chapterData;
  const imageTitle = formatImageTitle(chapter.mangaTitle);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="relative m-auto flex items-center justify-center h-64 md:h-80 lg:w-2/3 bg-cover bg-center text-white">
          <Image
            src={`https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${imageTitle}.jpg`}
            alt={`${chapter.mangaTitle} cover`}
            fill
            style={{ objectFit: 'cover' }}
            className="brightness-80 rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative flex items-center mx-auto justify-center z-10 lg:space-x-20">
            {prevChapter ? (
              <Link
                href={`/manga/${params.mangaId}/${prevChapter.id}`}
                className="text-white font-bold py-2 px-4"
              >
                <div className="flex items-center text-center hover:transform hover:scale-105 transition duration-100 ease-in-out space-x-2 text-3xl font-extrabold">
                  <div>
                    <FaArrowLeftLong size={25} />
                  </div>
                  <div className="text-3xl">{prevChapter.number}</div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}
            <Link href={`/manga/${params.mangaId}`} className="">
              <h1 className="text-3xl md:text-5xl font-bold text-center drop-shadow-lg">
                {chapter.mangaTitle.toUpperCase()} - CHAPITRE {chapter.number}
              </h1>
            </Link>
            {nextChapter ? (
              <Link
                href={`/manga/${params.mangaId}/${nextChapter.id}`}
                className="text-white font-bold py-2 px-4 "
              >
                <div className="flex items-center text-center hover:transform hover:scale-105 transition duration-100 ease-in-out space-x-2 text-3xl font-extrabold">
                  <div className="flex items-center space-x-2">
                    <div>{nextChapter.number}</div>
                    <div>
                      <FaArrowRightLong size={25} />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <ImageViewer images={chapter.images} />

        <div className="relative m-auto flex items-center justify-center h-64 md:h-80 lg:w-2/3 bg-cover bg-center text-white">
          <div className="absolute inset-0 bg-black bg-opacity-50">
            <Link href={`/manga/${params.mangaId}`} className="">
              <h1 className="text-3xl md:text-5xl font-bold text-center drop-shadow-lg">
                {chapter.mangaTitle.toUpperCase()} - CHAPITRE {chapter.number}
              </h1>
            </Link>
            <div className="relative flex items-center mx-auto justify-center z-10 lg:space-x-20">
              {prevChapter ? (
                <Link
                  href={`/manga/${params.mangaId}/${prevChapter.id}`}
                  className="text-white font-bold py-2 px-4"
                >
                  <div className="flex items-center text-center hover:transform hover:scale-105 transition duration-100 ease-in-out space-x-2 text-3xl font-extrabold">
                    <div>
                      <FaArrowLeftLong size={25} />
                    </div>
                    <div className="text-3xl">{prevChapter.number}</div>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {nextChapter ? (
                <Link
                  href={`/manga/${params.mangaId}/${nextChapter.id}`}
                  className="text-white font-bold py-2 px-4 "
                >
                  <div className="flex items-center text-center hover:transform hover:scale-105 transition duration-100 ease-in-out space-x-2 text-3xl font-extrabold">
                    <div className="flex items-center space-x-2">
                      <div>{nextChapter.number}</div>
                      <div>
                        <FaArrowRightLong size={25} />
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
