'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

import type { StepProps } from '@/types/submission';
import { ValidatedInput } from '@/components/forms/ValidatedInput';
import { useFormValidation } from '@/hooks/useFormValidation';
import { FormValidator } from '@/lib/validation';

export function ContactStep({ data, onUpdate, locale }: StepProps) {
  const t = useTranslations('submitBusiness.steps.contact');

  const { hasFieldError, getFieldError } = useFormValidation({
    data,
    locale,
    currentStep: 'contact',
    enableRealTimeValidation: true,
  });

  const updateContactField = useCallback((field: keyof typeof data.contact, value: string) => {
    onUpdate({
      contact: {
        ...data.contact,
        [field]: value
      }
    });
  }, [data.contact, onUpdate]);

  const validateEmail = useCallback((value: string) => {
    const errors = FormValidator.validateField('email', value, data, locale);
    return errors.length > 0 ? errors[0].message : null;
  }, [data, locale]);

  const validatePhone = useCallback((value: string) => {
    const errors = FormValidator.validateField('phone', value, data, locale);
    return errors.length > 0 ? errors[0].message : null;
  }, [data, locale]);

  const validateWebsite = useCallback((value: string) => {
    const errors = FormValidator.validateField('website', value, data, locale);
    return errors.length > 0 ? errors[0].message : null;
  }, [data, locale]);

  const formatPhoneNumber = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    updateContactField('phone', formatted);
  }, [formatPhoneNumber, updateContactField]);

  const formatWebsite = useCallback((value: string) => {
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  }, []);

  const handleWebsiteChange = useCallback((value: string) => {
    updateContactField('website', value);
  }, [updateContactField]);

  const handleWebsiteBlur = useCallback((value: string) => {
    if (value) {
      const formatted = formatWebsite(value);
      updateContactField('website', formatted);
    }
  }, [formatWebsite, updateContactField]);

  const hasValidContact = data.contact.phone || data.contact.email || data.contact.website;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center space-x-2 mb-4">
          <PhoneIcon className="h-8 w-8 text-chinese-red-600" />
          <EnvelopeIcon className="h-8 w-8 text-chinese-red-600" />
          <GlobeAltIcon className="h-8 w-8 text-chinese-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('description')}
        </p>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <PhoneIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{t('phone')}</span>
        </div>
        <ValidatedInput
          name="phone"
          label=""
          type="tel"
          value={data.contact.phone}
          onChange={handlePhoneChange}
          onValidate={validatePhone}
          placeholder={t('phonePlaceholder')}
          hint={t('phoneHelp')}
        />
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{t('email')}</span>
        </div>
        <ValidatedInput
          name="email"
          label=""
          type="email"
          value={data.contact.email}
          onChange={(value) => updateContactField('email', value)}
          onValidate={validateEmail}
          placeholder={t('emailPlaceholder')}
          hint={t('emailHelp')}
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <GlobeAltIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{t('website')}</span>
        </div>
        <ValidatedInput
          name="website"
          label=""
          type="url"
          value={data.contact.website}
          onChange={handleWebsiteChange}
          onValidate={validateWebsite}
          placeholder={t('websitePlaceholder')}
          hint={t('websiteHelp')}
        />
      </div>

      {/* Contact Method Requirement Notice */}
      {!hasValidContact && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                {t('contactRequired')}
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                {t('contactRequiredText')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">
          {t('privacyNotice')}
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• {t('privacy1')}</li>
          <li>• {t('privacy2')}</li>
          <li>• {t('privacy3')}</li>
        </ul>
      </div>

      {/* Contact Methods Summary */}
      {hasValidContact && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">
            {t('contactMethodsSummary')}
          </h4>
          <div className="space-y-2 text-sm text-green-700">
            {data.contact.phone && (
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>{data.contact.phone}</span>
              </div>
            )}
            {data.contact.email && (
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                <span>{data.contact.email}</span>
              </div>
            )}
            {data.contact.website && (
              <div className="flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                <span className="break-all">{data.contact.website}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}