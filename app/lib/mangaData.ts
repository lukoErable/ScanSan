import fs from 'fs';
import path from 'path';
import { Chapter, MangaBasic, MangaWithChapters } from '../types/index';

const scansDirectory = path.join(process.cwd(), 'app', 'scans');

export async function getAllMangas(): Promise<MangaBasic[]> {
  const mangaDirs = fs.readdirSync(scansDirectory);
  return mangaDirs.map((dir) => ({
    number: '1',
    id: dir,
    title: dir.replace(/-/g, ' '),
  }));
}

export async function getMangaData(
  mangaId: string
): Promise<MangaWithChapters> {
  const mangaPath = path.join(scansDirectory, mangaId);
  const chapters = fs
    .readdirSync(mangaPath)
    .filter((dir) => dir.startsWith('Chapter_'));
  return {
    number: '1',
    id: mangaId,
    title: mangaId.replace(/-/g, ' '),
    chapters: chapters.map((dir) => ({
      id: dir,
      number: dir.replace('Chapter_', ''),
    })),
  };
}

export async function getChapterData(
  mangaId: string,
  chapterId: string
): Promise<Chapter> {
  const chapterPath = path.join(scansDirectory, mangaId, chapterId);
  const linksFile = path.join(chapterPath, 'links.txt');
  const images = fs.readFileSync(linksFile, 'utf8').split('\n');
  return {
    mangaTitle: mangaId.replace(/-/g, ' '),
    number: chapterId.replace('Chapter_', ''),
    images,
    id: chapterId,
  };
}

export async function getAdjacentChapters(
  mangaId: string,
  currentChapterNumber: string
) {
  const manga = await getMangaData(mangaId);
  const sortedChapters = manga.chapters.sort(
    (a, b) => parseInt(a.number) - parseInt(b.number)
  );
  const currentIndex = sortedChapters.findIndex(
    (chapter) => chapter.number === currentChapterNumber
  );

  return {
    prevChapter: currentIndex > 0 ? sortedChapters[currentIndex - 1] : null,
    nextChapter:
      currentIndex < sortedChapters.length - 1
        ? sortedChapters[currentIndex + 1]
        : null,
  };
}
