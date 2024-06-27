const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const mangas = [
  'tokyo-ghoul',
  'blue-exorcist',
  'blue-lock',
  'chainsaw-man',
  'erased',
  'fire-force',
  'frieren',
  'hells-paradise',
  'kingdom',
  'made-in-abyss',
  'mashle',
  'monster',
  'one-punch-man',
  'ragna-crimson',
  'soul-eater',
  'temgoku-daimakyou',
  'tokyo-revengers',
  'vinland-saga',
  'wind-breaker',
];
const baseUrl = 'https://anime-sama.fr/s2/scans/';
const baseOutputDir = path.join(__dirname, '..', 'scans');

function formatMangaName(name) {
  let formatted = name.replace(/-/g, ' ');
  formatted = formatted
    .split(' ')
    .map((word) => {
      if (word !== 'of' && word !== 'and' && word !== 'x' && word !== 'no') {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
  formatted = formatted.replace(/ /g, '%20');
  return formatted;
}

function formatLinkForFile(url) {
  return url.replace(/ /g, '%20');
}

async function checkImageExists(url) {
  try {
    await axios.head(url);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    throw error;
  }
}

async function processChapter(manga, formattedManga, chapter) {
  const chapterDir = path.join(baseOutputDir, manga, `Chapter_${chapter}`);
  let pageNumber = 1;
  let hasMorePages = true;
  const links = [];

  while (hasMorePages) {
    const url = `${baseUrl}${formattedManga}/${chapter}/${pageNumber}.jpg`;

    try {
      const exists = await checkImageExists(url);
      if (exists) {
        links.push(formatLinkForFile(url));
        console.log(`Found: ${url}`);
        pageNumber++;
      } else {
        hasMorePages = false;
      }
    } catch (error) {
      console.error(`Error checking ${url}: ${error.message}`);
      hasMorePages = false;
    }
  }

  if (links.length > 0) {
    await fs.ensureDir(chapterDir);
    const linksFile = path.join(chapterDir, 'links.txt');
    await fs.writeFile(linksFile, links.join('\n'));
    console.log(`Saved ${links.length} links for ${manga} Chapter ${chapter}`);
    return true;
  }
  return false;
}

async function processManga(manga) {
  const formattedManga = formatMangaName(manga);
  console.log(`Processing manga: ${formattedManga}`);
  let chapter = 1;
  let hasMoreChapters = true;
  let emptyChaptersCount = 0;

  while (hasMoreChapters && emptyChaptersCount < 3) {
    try {
      const hasLinks = await processChapter(manga, formattedManga, chapter);
      if (hasLinks) {
        emptyChaptersCount = 0;
      } else {
        emptyChaptersCount++;
      }
      chapter++;
    } catch (error) {
      console.error(
        `Error processing chapter ${chapter} of ${manga}: ${error.message}`
      );
      emptyChaptersCount++;
    }

    if (emptyChaptersCount >= 3) {
      console.log(
        `No more chapters found for ${manga} after 3 empty attempts.`
      );
      hasMoreChapters = false;
    }
  }
}

async function main() {
  for (const manga of mangas) {
    await processManga(manga);
  }
  console.log('All mangas processed');
}

main().catch(console.error);
