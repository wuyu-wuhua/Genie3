import { zhTranslations } from './zh';
import { enTranslations } from './en';

export type Language = 'zh' | 'en';

export const getTranslations = (language: Language) => {
  return language === 'zh' ? zhTranslations : enTranslations;
};

export { zhTranslations, enTranslations };

