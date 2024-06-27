import Image from 'next/image';
import { useEffect } from 'react';

export default function ImageViewer({ images }: { images: string[] }) {
  useEffect(() => {
    // Précharger les images suivantes
    images.forEach((image, index) => {
      if (index > 0) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = image;
        document.head.appendChild(link);
      }
    });
  }, [images]);

  return (
    <div className="flex flex-col m-auto items-center">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`Page ${index + 1}`}
          width={700}
          height={700}
          priority={index === 0} // Charger en priorité la première image
          loading={index === 0 ? 'eager' : 'lazy'} // Lazy load pour les images suivantes
        />
      ))}
    </div>
  );
}
