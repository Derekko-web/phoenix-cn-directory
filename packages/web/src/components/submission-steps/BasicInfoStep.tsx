'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TagIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

import type { StepProps } from '@/types/submission';
import { categoriesApi, type Category } from '@/lib/api';
import { ValidatedInput } from '@/components/forms/ValidatedInput';
import { useFormValidation } from '@/hooks/useFormValidation';
import { FormValidator } from '@/lib/validation';

export function BasicInfoStep({ data, onUpdate, locale }: StepProps) {
  const t = useTranslations('submitBusiness.steps.basicInfo');
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { hasFieldError, getFieldError, validateField } = useFormValidation({
    data,
    locale,
    currentStep: 'basic',
    enableRealTimeValidation: true,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await categoriesApi.getCategories();
        // Filter for parent categories only for initial selection
        setAvailableCategories(categories.filter(cat => !cat.parentId));
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const updateLocalizedField = useCallback((lang: 'en' | 'zh', field: string, value: string) => {
    const updatedLocalized = data.localized.map(item => 
      item.lang === lang ? { ...item, [field]: value } : item
    );
    onUpdate({ localized: updatedLocalized });
  }, [data.localized, onUpdate]);

  const validateBusinessName = useCallback((value: string, lang: 'en' | 'zh') => {
    const errors = FormValidator.validateField('businessName', value, data, locale);
    return errors.length > 0 ? errors[0].message : null;
  }, [data, locale]);

  const validateBusinessDescription = useCallback((value: string) => {
    const errors = FormValidator.validateField('businessDescription', value, data, locale);
    return errors.length > 0 ? errors[0].message : null;
  }, [data, locale]);

  const toggleCategory = (category: Category) => {
    const isSelected = data.categories.some(c => c.id === category.id);
    const updatedCategories = isSelected
      ? data.categories.filter(c => c.id !== category.id)
      : [...data.categories, category];
    
    onUpdate({ categories: updatedCategories });
  };

  const englishData = data.localized.find(l => l.lang === 'en') || data.localized[0];
  const chineseData = data.localized.find(l => l.lang === 'zh') || data.localized[1];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <BuildingStorefrontIcon className="h-12 w-12 text-chinese-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Business Name - English */}
      <ValidatedInput
        name="nameEn"
        label={t('nameEn')}
        value={englishData?.name || ''}
        onChange={(value) => updateLocalizedField('en', 'name', value)}
        onValidate={(value) => validateBusinessName(value, 'en')}
        placeholder={t('nameEnPlaceholder')}
        required={true}
        maxLength={100}
        showCharCount={true}
        hint={t('nameEnHelp')}
        lang="en"
      />

      {/* Business Name - Chinese */}
      <ValidatedInput
        name="nameZh"
        label={t('nameZh')}
        value={chineseData?.name || ''}
        onChange={(value) => updateLocalizedField('zh', 'name', value)}
        onValidate={(value) => validateBusinessName(value, 'zh')}
        placeholder={t('nameZhPlaceholder')}
        maxLength={100}
        showCharCount={true}
        hint={t('nameZhHelp')}
        lang="zh"
      />

      {/* Business Description - English */}
      <ValidatedInput
        name="descriptionEn"
        label={t('descriptionEn')}
        type="textarea"
        value={englishData?.description || ''}
        onChange={(value) => updateLocalizedField('en', 'description', value)}
        onValidate={validateBusinessDescription}
        placeholder={t('descriptionEnPlaceholder')}
        rows={4}
        maxLength={500}
        showCharCount={true}
        hint={t('descriptionEnHelp')}
        lang="en"
      />

      {/* Business Description - Chinese */}
      <ValidatedInput
        name="descriptionZh"
        label={t('descriptionZh')}
        type="textarea"
        value={chineseData?.description || ''}
        onChange={(value) => updateLocalizedField('zh', 'description', value)}
        onValidate={validateBusinessDescription}
        placeholder={t('descriptionZhPlaceholder')}
        rows={4}
        maxLength={500}
        showCharCount={true}
        hint={t('descriptionZhHelp')}
        lang="zh"
      />

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <TagIcon className="h-4 w-4 inline mr-2" />
          {t('categories')} <span className="text-red-500">*</span>
        </label>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableCategories.map((category) => {
              const isSelected = data.categories.some(c => c.id === category.id);
              
              return (
                <motion.button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-chinese-red-50 border-chinese-red-200 text-chinese-red-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    {category.icon && (
                      <span className="text-lg mr-2">{category.icon}</span>
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {locale === 'zh' ? category.nameZh : category.nameEn}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
        
        <p className="mt-2 text-sm text-gray-500">
          {t('categoriesHelp')}
        </p>
        
        {data.categories.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t('selectedCategories')}:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-3 py-1 bg-chinese-red-100 text-chinese-red-800 text-sm rounded-full"
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {locale === 'zh' ? category.nameZh : category.nameEn}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Required Fields Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <span className="font-medium">{t('requiredNotice')}:</span> {t('requiredFields')}
        </p>
      </div>
    </div>
  );
}