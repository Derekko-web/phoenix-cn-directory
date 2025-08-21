import type { BusinessSubmissionData, ValidationError } from '@/types/submission';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class FormValidator {
  private static readonly CHINESE_CHAR_REGEX = /[\u4e00-\u9fff]/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^[\+]?[0-9\-\(\)\s]{10,}$/;
  private static readonly URL_REGEX = /^https?:\/\/.+/;
  private static readonly ZIP_REGEX = /^\d{5}(-\d{4})?$/;

  static validateStep(stepKey: string, data: BusinessSubmissionData, locale: 'en' | 'zh'): ValidationResult {
    const errors: ValidationError[] = [];

    switch (stepKey) {
      case 'basic':
        this.validateBasicInfo(data, errors, locale);
        break;
      case 'location':
        this.validateLocation(data, errors, locale);
        break;
      case 'contact':
        this.validateContact(data, errors, locale);
        break;
      case 'hours':
        this.validateHours(data, errors, locale);
        break;
      case 'photos':
        this.validatePhotos(data, errors, locale);
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateField(field: string, value: any, data: BusinessSubmissionData, locale: 'en' | 'zh'): ValidationError[] {
    const errors: ValidationError[] = [];

    switch (field) {
      case 'businessName':
        this.validateBusinessName(value, errors, locale);
        break;
      case 'businessDescription':
        this.validateBusinessDescription(value, errors, locale);
        break;
      case 'email':
        this.validateEmailField(value, errors, locale);
        break;
      case 'phone':
        this.validatePhoneField(value, errors, locale);
        break;
      case 'website':
        this.validateWebsiteField(value, errors, locale);
        break;
      case 'address':
        this.validateAddressField(value, errors, locale);
        break;
      case 'city':
        this.validateCityField(value, errors, locale);
        break;
      case 'zip':
        this.validateZipField(value, errors, locale);
        break;
    }

    return errors;
  }

  private static validateBasicInfo(data: BusinessSubmissionData, errors: ValidationError[], locale: 'en' | 'zh'): void {
    // Check if at least one business name is provided
    const hasValidName = data.localized.some(l => l.name.trim().length > 0);
    if (!hasValidName) {
      errors.push({
        field: 'businessName',
        message: locale === 'en' ? 'Business name is required' : '商户名称必填',
      });
    }

    // Validate individual names
    data.localized.forEach((localized, index) => {
      if (localized.name.trim()) {
        this.validateBusinessName(localized.name, errors, locale, localized.lang);
      }
      
      if (localized.description.trim()) {
        this.validateBusinessDescription(localized.description, errors, locale, localized.lang);
      }
    });

    // Check categories
    if (data.categories.length === 0) {
      errors.push({
        field: 'categories',
        message: locale === 'en' ? 'At least one category is required' : '至少选择一个分类',
      });
    }
  }

  private static validateLocation(data: BusinessSubmissionData, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const { location } = data;

    if (!location.addressLines[0]?.trim()) {
      errors.push({
        field: 'address',
        message: locale === 'en' ? 'Address is required' : '地址必填',
      });
    }

    if (!location.city?.trim()) {
      errors.push({
        field: 'city',
        message: locale === 'en' ? 'City is required' : '城市必填',
      });
    }

    if (!location.zip?.trim()) {
      errors.push({
        field: 'zip',
        message: locale === 'en' ? 'ZIP code is required' : '邮编必填',
      });
    } else if (!this.ZIP_REGEX.test(location.zip.trim())) {
      errors.push({
        field: 'zip',
        message: locale === 'en' ? 'Invalid ZIP code format' : '邮编格式无效',
      });
    }
  }

  private static validateContact(data: BusinessSubmissionData, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const { contact } = data;
    const hasAnyContact = contact.phone?.trim() || contact.email?.trim() || contact.website?.trim();

    if (!hasAnyContact) {
      errors.push({
        field: 'contact',
        message: locale === 'en' 
          ? 'At least one contact method is required' 
          : '至少需要提供一种联系方式',
      });
    }

    if (contact.email?.trim()) {
      this.validateEmailField(contact.email, errors, locale);
    }

    if (contact.phone?.trim()) {
      this.validatePhoneField(contact.phone, errors, locale);
    }

    if (contact.website?.trim()) {
      this.validateWebsiteField(contact.website, errors, locale);
    }
  }

  private static validateHours(data: BusinessSubmissionData, errors: ValidationError[], locale: 'en' | 'zh'): void {
    // Hours are optional, but if provided, validate format
    data.hours.forEach((hour, index) => {
      if (!hour.isClosed && !hour.is24h) {
        if (!hour.openTime || !hour.closeTime) {
          errors.push({
            field: `hours.${index}`,
            message: locale === 'en' 
              ? 'Open and close times are required' 
              : '需要设置营业时间和打烊时间',
          });
        }
      }
    });
  }

  private static validatePhotos(data: BusinessSubmissionData, errors: ValidationError[], locale: 'en' | 'zh'): void {
    // Photos are optional - no validation needed
  }

  private static validateBusinessName(name: string, errors: ValidationError[], locale: 'en' | 'zh', lang?: 'en' | 'zh'): void {
    const trimmed = name.trim();
    
    if (trimmed.length < 2) {
      errors.push({
        field: 'businessName',
        message: locale === 'en' 
          ? 'Business name must be at least 2 characters' 
          : '商户名称至少需要2个字符',
      });
    }

    if (trimmed.length > 100) {
      errors.push({
        field: 'businessName',
        message: locale === 'en' 
          ? 'Business name cannot exceed 100 characters' 
          : '商户名称不能超过100个字符',
      });
    }

    // If this is Chinese input, validate Chinese characters
    if (lang === 'zh' && !this.CHINESE_CHAR_REGEX.test(trimmed)) {
      errors.push({
        field: 'businessName',
        message: locale === 'en' 
          ? 'Chinese name should contain Chinese characters' 
          : '中文名称应包含中文字符',
      });
    }
  }

  private static validateBusinessDescription(description: string, errors: ValidationError[], locale: 'en' | 'zh', lang?: 'en' | 'zh'): void {
    const trimmed = description.trim();
    
    if (trimmed.length > 500) {
      errors.push({
        field: 'businessDescription',
        message: locale === 'en' 
          ? 'Description cannot exceed 500 characters' 
          : '描述不能超过500个字符',
      });
    }
  }

  private static validateEmailField(email: string, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const trimmed = email.trim();
    
    if (!this.EMAIL_REGEX.test(trimmed)) {
      errors.push({
        field: 'email',
        message: locale === 'en' ? 'Invalid email format' : '邮箱格式无效',
      });
    }
  }

  private static validatePhoneField(phone: string, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const trimmed = phone.trim();
    
    if (!this.PHONE_REGEX.test(trimmed)) {
      errors.push({
        field: 'phone',
        message: locale === 'en' ? 'Invalid phone number format' : '电话号码格式无效',
      });
    }
  }

  private static validateWebsiteField(website: string, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const trimmed = website.trim();
    
    if (!this.URL_REGEX.test(trimmed)) {
      errors.push({
        field: 'website',
        message: locale === 'en' ? 'Website must start with http:// or https://' : '网站地址必须以 http:// 或 https:// 开头',
      });
    }
  }

  private static validateAddressField(address: string, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const trimmed = address.trim();
    
    if (trimmed.length < 5) {
      errors.push({
        field: 'address',
        message: locale === 'en' ? 'Address must be at least 5 characters' : '地址至少需要5个字符',
      });
    }
  }

  private static validateCityField(city: string, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const trimmed = city.trim();
    
    if (trimmed.length < 2) {
      errors.push({
        field: 'city',
        message: locale === 'en' ? 'City name must be at least 2 characters' : '城市名称至少需要2个字符',
      });
    }
  }

  private static validateZipField(zip: string, errors: ValidationError[], locale: 'en' | 'zh'): void {
    const trimmed = zip.trim();
    
    if (!this.ZIP_REGEX.test(trimmed)) {
      errors.push({
        field: 'zip',
        message: locale === 'en' ? 'Invalid ZIP code format (e.g., 12345 or 12345-6789)' : '邮编格式无效 (例如: 12345 或 12345-6789)',
      });
    }
  }

  static hasChinese(text: string): boolean {
    return this.CHINESE_CHAR_REGEX.test(text);
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }
}