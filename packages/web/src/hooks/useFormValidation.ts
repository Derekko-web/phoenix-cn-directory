import { useState, useCallback, useEffect } from 'react';
import { FormValidator, ValidationResult } from '@/lib/validation';
import type { BusinessSubmissionData, ValidationError } from '@/types/submission';

interface UseFormValidationProps {
  data: BusinessSubmissionData;
  locale: 'en' | 'zh';
  currentStep: string;
  enableRealTimeValidation?: boolean;
}

interface UseFormValidationReturn {
  errors: ValidationError[];
  fieldErrors: { [field: string]: ValidationError[] };
  isValid: boolean;
  isStepValid: (stepKey: string) => boolean;
  validateStep: (stepKey: string) => ValidationResult;
  validateField: (field: string, value: any) => ValidationError[];
  clearFieldErrors: (field: string) => void;
  clearAllErrors: () => void;
  hasFieldError: (field: string) => boolean;
  getFieldError: (field: string) => string | null;
}

export function useFormValidation({
  data,
  locale,
  currentStep,
  enableRealTimeValidation = true,
}: UseFormValidationProps): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ [field: string]: ValidationError[] }>({});

  // Validate current step whenever data changes
  useEffect(() => {
    if (enableRealTimeValidation && data) {
      const result = FormValidator.validateStep(currentStep, data, locale);
      setErrors(result.errors);
      
      // Group errors by field
      const grouped: { [field: string]: ValidationError[] } = {};
      result.errors.forEach(error => {
        if (!grouped[error.field]) {
          grouped[error.field] = [];
        }
        grouped[error.field].push(error);
      });
      setFieldErrors(grouped);
    }
  }, [data, locale, currentStep, enableRealTimeValidation]);

  const validateStep = useCallback((stepKey: string): ValidationResult => {
    const result = FormValidator.validateStep(stepKey, data, locale);
    
    if (stepKey === currentStep) {
      setErrors(result.errors);
      
      // Group errors by field
      const grouped: { [field: string]: ValidationError[] } = {};
      result.errors.forEach(error => {
        if (!grouped[error.field]) {
          grouped[error.field] = [];
        }
        grouped[error.field].push(error);
      });
      setFieldErrors(grouped);
    }
    
    return result;
  }, [data, locale, currentStep]);

  const isStepValid = useCallback((stepKey: string): boolean => {
    const result = FormValidator.validateStep(stepKey, data, locale);
    return result.isValid;
  }, [data, locale]);

  const validateField = useCallback((field: string, value: any): ValidationError[] => {
    const fieldErrors = FormValidator.validateField(field, value, data, locale);
    
    if (enableRealTimeValidation) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: fieldErrors,
      }));
      
      // Update main errors array
      setErrors(prev => {
        const filtered = prev.filter(error => error.field !== field);
        return [...filtered, ...fieldErrors];
      });
    }
    
    return fieldErrors;
  }, [data, locale, enableRealTimeValidation]);

  const clearFieldErrors = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newFieldErrors = { ...prev };
      delete newFieldErrors[field];
      return newFieldErrors;
    });
    
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setFieldErrors({});
  }, []);

  const hasFieldError = useCallback((field: string): boolean => {
    return fieldErrors[field] && fieldErrors[field].length > 0;
  }, [fieldErrors]);

  const getFieldError = useCallback((field: string): string | null => {
    const fieldErrorList = fieldErrors[field];
    if (fieldErrorList && fieldErrorList.length > 0) {
      return fieldErrorList[0].message;
    }
    return null;
  }, [fieldErrors]);

  return {
    errors,
    fieldErrors,
    isValid: errors.length === 0,
    isStepValid,
    validateStep,
    validateField,
    clearFieldErrors,
    clearAllErrors,
    hasFieldError,
    getFieldError,
  };
}