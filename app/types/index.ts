export interface MangaBasic {
  id: string;
  title: string;
  number: string;
}

export interface ChapterBasic {
  id: string;
  number: string;
}

export interface MangaWithChapters extends MangaBasic {
  chapters: ChapterBasic[];
}

export interface Chapter extends ChapterBasic {
  id: string;
  mangaTitle: string;
  images: string[];
}
