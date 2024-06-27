import MangaSearch from '../components/MangaSearch';
import { getAllMangas } from '../lib/mangaData';

export default async function MangaListPage() {
  const mangas = await getAllMangas();

  return (
    <div>
      <MangaSearch initialMangas={mangas} />
    </div>
  );
}
