'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useRef } from 'react';
import { CameraIcon, PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

import type { StepProps, PhotoUpload } from '@/types/submission';

export function PhotosStep({ data, onUpdate, locale }: StepProps) {
  const t = useTranslations('submitBusiness.steps.photos');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;

    const newPhotos: PhotoUpload[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert(t('errors.invalidFileType', { name: file.name }));
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        alert(t('errors.fileTooLarge', { name: file.name }));
        continue;
      }

      const photoId = `temp-${Date.now()}-${i}`;
      const previewUrl = URL.createObjectURL(file);

      newPhotos.push({
        id: photoId,
        file,
        preview: previewUrl,
        caption: '',
        isUploading: false,
        uploadProgress: 0,
      });
    }

    if (newPhotos.length > 0) {
      const updatedPhotos = [...(data.photos || []), ...newPhotos];
      onUpdate({ photos: updatedPhotos });
    }
  }, [data.photos, onUpdate, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removePhoto = useCallback((photoId: string) => {
    const updatedPhotos = (data.photos || []).filter(photo => {
      if (photo.id === photoId && photo.preview) {
        URL.revokeObjectURL(photo.preview);
      }
      return photo.id !== photoId;
    });
    onUpdate({ photos: updatedPhotos });
  }, [data.photos, onUpdate]);

  const updateCaption = useCallback((photoId: string, caption: string) => {
    const updatedPhotos = (data.photos || []).map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    );
    onUpdate({ photos: updatedPhotos });
  }, [data.photos, onUpdate]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const photos = data.photos || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <CameraIcon className="h-12 w-12 text-chinese-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Photo Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 hover:border-chinese-red-400 rounded-xl p-8 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('uploadArea.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('uploadArea.description')}
          </p>
          
          <button
            type="button"
            onClick={triggerFileInput}
            className="px-6 py-3 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 inline mr-2" />
            {t('uploadPhotos')}
          </button>
          
          <p className="text-gray-500 text-sm mt-2">
            {t('uploadArea.formats')}
          </p>
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t('selectedPhotos')} ({photos.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.preview || photo.url}
                      alt={photo.caption || 'Business photo'}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Upload Progress */}
                    {photo.isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-sm">
                          {uploadProgress[photo.id] || 0}%
                        </div>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Caption Input */}
                  <input
                    type="text"
                    placeholder={t('captionPlaceholder')}
                    value={photo.caption}
                    onChange={(e) => updateCaption(photo.id, e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Photo Guidelines */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">
          {t('photoGuidelines')}
        </h4>
        <ul className="text-green-700 text-sm space-y-1">
          <li>• {t('guideline1')}</li>
          <li>• {t('guideline2')}</li>
          <li>• {t('guideline3')}</li>
          <li>• {t('guideline4')}</li>
          <li>• {t('guideline5')}</li>
        </ul>
      </div>

      {/* Skip Notice */}
      {photos.length === 0 && (
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t('skipNotice')}
          </div>
        </div>
      )}
    </div>
  );
}