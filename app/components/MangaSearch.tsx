'use client';

import { useState } from 'react';
import { MangaBasic } from '../types/index';
import MangaList from './MangaList';

interface MangaSearchProps {
  initialMangas: MangaBasic[];
}

export default function MangaSearch({ initialMangas }: MangaSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMangas, setFilteredMangas] = useState(initialMangas);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = initialMangas.filter((manga) =>
      manga.title.toLowerCase().includes(term)
    );
    setFilteredMangas(filtered);
  };

  return (
    <div className="">
      <input
        type="text"
        placeholder="Rechercher des scans..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-1/4 min-w-fit p-2 mb-4 border border-black rounded-full m-auto block text-center text-white bg-blue"
      />
      <MangaList mangas={filteredMangas} />
    </div>
  );
}
