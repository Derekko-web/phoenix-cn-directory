'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { type Photo } from '@/lib/api';

interface BusinessPhotosProps {
  photos: Photo[];
  businessName: string;
}

export function BusinessPhotos({ photos, businessName }: BusinessPhotosProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="relative aspect-square cursor-pointer rounded-lg overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption || `${businessName} photo ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Modal for selected photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || businessName}
              width={800}
              height={600}
              className="object-contain max-w-full max-h-full"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            {selectedPhoto.caption && (
              <div className="absolute bottom-4 left-4 right-4 text-white bg-black/50 rounded-lg p-4">
                {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}