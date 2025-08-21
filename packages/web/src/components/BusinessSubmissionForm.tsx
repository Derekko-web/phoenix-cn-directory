'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircleIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ClockIcon,
  CameraIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

import { BasicInfoStep } from '@/components/submission-steps/BasicInfoStep';
import { LocationStep } from '@/components/submission-steps/LocationStep';
import { ContactStep } from '@/components/submission-steps/ContactStep';
import { HoursStep } from '@/components/submission-steps/HoursStep';
import { PhotosStep } from '@/components/submission-steps/PhotosStep';
import { PreviewStep } from '@/components/submission-steps/PreviewStep';

import { businessApi } from '@/lib/api';
import type { BusinessSubmissionData } from '@/types/submission';

interface BusinessSubmissionFormProps {
  locale: 'en' | 'zh';
}

const STEPS = [
  { 
    key: 'basic', 
    icon: BuildingStorefrontIcon, 
    titleKey: 'steps.basic',
    descriptionKey: 'steps.basicDescription'
  },
  { 
    key: 'location', 
    icon: MapPinIcon, 
    titleKey: 'steps.location',
    descriptionKey: 'steps.locationDescription'
  },
  { 
    key: 'contact', 
    icon: 'ContactIcon', 
    titleKey: 'steps.contact',
    descriptionKey: 'steps.contactDescription'
  },
  { 
    key: 'hours', 
    icon: ClockIcon, 
    titleKey: 'steps.hours',
    descriptionKey: 'steps.hoursDescription'
  },
  { 
    key: 'photos', 
    icon: CameraIcon, 
    titleKey: 'steps.photos',
    descriptionKey: 'steps.photosDescription'
  },
  { 
    key: 'preview', 
    icon: EyeIcon, 
    titleKey: 'steps.preview',
    descriptionKey: 'steps.previewDescription'
  },
];

export function BusinessSubmissionForm({ locale }: BusinessSubmissionFormProps) {
  const router = useRouter();
  const t = useTranslations('submitBusiness');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BusinessSubmissionData>({
    // Basic Info
    localized: [
      { lang: 'en', name: '', description: '', slugLocalized: '' },
      { lang: 'zh', name: '', description: '', slugLocalized: '' }
    ],
    categories: [],
    
    // Location
    location: {
      addressLines: [''],
      city: '',
      state: 'AZ',
      zip: ''
    },
    
    // Contact
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    
    // Hours
    hours: [],
    
    // Photos
    photos: [],
    
    // Metadata
    status: 'PENDING'
  });

  const updateFormData = useCallback((updates: Partial<BusinessSubmissionData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const isStepValid = (stepIndex: number): boolean => {
    const step = STEPS[stepIndex];
    
    switch (step.key) {
      case 'basic':
        return formData.localized.some(l => l.name.trim() !== '') && 
               formData.categories.length > 0;
      case 'location':
        return formData.location?.addressLines[0]?.trim() !== '' &&
               formData.location?.city?.trim() !== '' &&
               formData.location?.zip?.trim() !== '';
      case 'contact':
        return formData.contact?.phone?.trim() !== '' || 
               formData.contact?.email?.trim() !== '' ||
               formData.contact?.website?.trim() !== '';
      case 'hours':
        return true; // Hours are optional
      case 'photos':
        return true; // Photos are optional
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Clean up the form data for API submission
      const submissionData = {
        status: formData.status,
        localized: formData.localized.filter(l => l.name.trim() !== ''),
        contact: formData.contact,
        location: formData.location,
        hours: formData.hours,
        categoryIds: formData.categories.map(c => c.id)
      };

      const business = await businessApi.createBusiness(submissionData);
      
      // Redirect to success page or the created business
      router.push(`/${locale}/business/${business.slug}?submitted=true`);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error instanceof Error ? error.message : t('errors.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepKey = STEPS[currentStep].key;
    
    switch (stepKey) {
      case 'basic':
        return (
          <BasicInfoStep
            data={formData}
            onUpdate={updateFormData}
            locale={locale}
          />
        );
      case 'location':
        return (
          <LocationStep
            data={formData}
            onUpdate={updateFormData}
            locale={locale}
          />
        );
      case 'contact':
        return (
          <ContactStep
            data={formData}
            onUpdate={updateFormData}
            locale={locale}
          />
        );
      case 'hours':
        return (
          <HoursStep
            data={formData}
            onUpdate={updateFormData}
            locale={locale}
          />
        );
      case 'photos':
        return (
          <PhotosStep
            data={formData}
            onUpdate={updateFormData}
            locale={locale}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            data={formData}
            locale={locale}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto container ios-safe-bottom">
      {/* Progress Indicator */}
      <div className="mb-6 md:mb-8">
        {/* Desktop Progress Bar */}
        <div className="hidden md:flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isValid = isStepValid(index);
            
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-chinese-red-600 border-chinese-red-600 text-white'
                        : isCurrent
                        ? 'border-chinese-red-600 bg-white text-chinese-red-600'
                        : isValid
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-gray-100 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </motion.div>
                  
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${
                      isCurrent ? 'text-chinese-red-600' : 'text-gray-500'
                    }`}>
                      {t(step.titleKey)}
                    </div>
                    <div className="text-xs text-gray-400 max-w-20">
                      {t(step.descriptionKey)}
                    </div>
                  </div>
                </div>
                
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-chinese-red-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t(STEPS[currentStep].titleKey)}
            </h3>
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {STEPS.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-chinese-red-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8 form-step">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Error Display */}
        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-800">{submissionError}</p>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              {t('navigation.back')}
            </button>

            <div className="text-sm text-gray-500">
              {t('navigation.stepCount', { current: currentStep + 1, total: STEPS.length })}
            </div>

            {!isLastStep ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center px-6 py-3 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {t('navigation.next')}
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="flex items-center px-8 py-3 bg-chinese-gold-600 text-white rounded-lg hover:bg-chinese-gold-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isSubmitting ? t('navigation.submitting') : t('navigation.submit')}
              </button>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            <div className="text-center text-sm text-gray-500">
              {t('navigation.stepCount', { current: currentStep + 1, total: STEPS.length })}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  {t('navigation.back')}
                </button>
              )}
              
              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-chinese-red-600 text-white rounded-lg hover:bg-chinese-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {t('navigation.next')}
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-chinese-gold-600 text-white rounded-lg hover:bg-chinese-gold-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isSubmitting ? t('navigation.submitting') : t('navigation.submit')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}