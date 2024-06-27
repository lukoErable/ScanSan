import { NextRequest, NextResponse } from 'next/server';
import {
  getAdjacentChapters,
  getAllMangas,
  getChapterData,
  getMangaData,
} from '../../lib/mangaData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mangaId = searchParams.get('mangaId');
  const chapterId = searchParams.get('chapterId');

  if (!mangaId) {
    const mangas = await getAllMangas();
    return NextResponse.json(mangas);
  }

  if (!chapterId) {
    const manga = await getMangaData(mangaId);
    return NextResponse.json(manga);
  }

  const chapter = await getChapterData(mangaId, chapterId);
  const adjacentChapters = await getAdjacentChapters(mangaId, chapter.number);

  return NextResponse.json({ chapter, ...adjacentChapters });
}
