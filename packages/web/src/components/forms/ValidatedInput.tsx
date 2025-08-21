'use client';

import { useState, useCallback, useEffect } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidatedInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  onValidate?: (value: string) => string | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  showCharCount?: boolean;
  debounceMs?: number;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  hint?: string;
  lang?: 'en' | 'zh';
}

export function ValidatedInput({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onValidate,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  rows = 3,
  className = '',
  showCharCount = false,
  debounceMs = 300,
  validateOnBlur = true,
  validateOnChange = true,
  hint,
  lang,
}: ValidatedInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  const validate = useCallback((inputValue: string) => {
    if (onValidate) {
      const errorMessage = onValidate(inputValue);
      setError(errorMessage);
      setIsValid(errorMessage === null);
      return errorMessage;
    }
    return null;
  }, [onValidate]);

  const debouncedValidate = useCallback((inputValue: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      validate(inputValue);
    }, debounceMs);

    setDebounceTimeout(timeout);
  }, [validate, debounceMs, debounceTimeout]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    if (validateOnChange && onValidate) {
      debouncedValidate(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    if (validateOnBlur && onValidate) {
      validate(value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setError(null);
    setIsValid(null);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-all duration-200
    ${error 
      ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
      : isValid 
      ? 'border-green-500 bg-green-50 focus:ring-2 focus:ring-green-200 focus:border-green-500'
      : 'border-gray-300 bg-white hover:border-gray-400 focus:ring-2 focus:ring-chinese-red-200 focus:border-chinese-red-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}
    ${lang === 'zh' ? 'font-chinese' : ''}
    outline-none
    ${className}
  `.trim();

  const characterCount = value.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isOverLimit = maxLength && characterCount > maxLength;

  const InputElement = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      {/* Label */}
      <label 
        htmlFor={name}
        className={`block text-sm font-medium ${error ? 'text-red-700' : 'text-gray-700'}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      <div className="relative">
        <InputElement
          id={name}
          name={name}
          type={type === 'textarea' ? undefined : type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={type === 'textarea' ? rows : undefined}
          className={inputClasses}
          aria-invalid={error !== null}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {/* Validation Icons */}
        <div className="absolute right-3 top-3 flex items-center space-x-2">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </motion.div>
            )}
            {isValid && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character Count */}
      {showCharCount && maxLength && (
        <div className="flex justify-between items-center text-xs">
          <div></div>
          <div className={`${
            isOverLimit 
              ? 'text-red-500 font-medium' 
              : isNearLimit 
              ? 'text-yellow-600' 
              : 'text-gray-500'
          }`}>
            {characterCount}/{maxLength}
          </div>
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${name}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-600 flex items-center space-x-2"
          >
            <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {hint && !error && (
        <div className="text-sm text-gray-500">
          {hint}
        </div>
      )}

      {/* Focus Indicator for Better UX */}
      {isFocused && !error && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          exit={{ width: 0 }}
          className="h-0.5 bg-chinese-red-500 rounded-full"
        />
      )}
    </div>
  );
}