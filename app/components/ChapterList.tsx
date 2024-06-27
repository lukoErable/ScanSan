// components/ChapterList.tsx
import Link from 'next/link';
import { ChapterBasic } from '../types';

interface ChapterListProps {
  chapters: ChapterBasic[];
  mangaId: string;
}

export default function ChapterList({ chapters, mangaId }: ChapterListProps) {
  return (
    <ul>
      {chapters.map((chapter) => (
        <li key={chapter.id}>
          <Link href={`/manga/${mangaId}/${chapter.id}`}>
            Chapitre {chapter.number}
          </Link>
        </li>
      ))}
    </ul>
  );
}
