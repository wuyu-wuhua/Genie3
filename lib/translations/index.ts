import { zhTranslations } from './zh';
import { enTranslations } from './en';
import { ruTranslations } from './ru';
import { frTranslations } from './fr';
import { jaTranslations } from './ja';
import { itTranslations } from './it';
import { koTranslations } from './ko';
import { deTranslations } from './de';
import { esTranslations } from './es';

export type Language = 'zh' | 'en' | 'ru' | 'fr' | 'ja' | 'it' | 'ko' | 'de' | 'es';

// 语言映射配置
export const languageConfig = {
  zh: {
    name: '中文',
    flag: '🇨🇳',
    nativeName: '中文'
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  ru: {
    name: 'Русский',
    flag: '🇷🇺',
    nativeName: 'Русский'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    nativeName: 'Français'
  },
  ja: {
    name: '日本語',
    flag: '🇯🇵',
    nativeName: '日本語'
  },
  it: {
    name: 'Italiano',
    flag: '🇮🇹',
    nativeName: 'Italiano'
  },
  ko: {
    name: '한국어',
    flag: '🇰🇷',
    nativeName: '한국어'
  },
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    nativeName: 'Deutsch'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    nativeName: 'Español'
  }
};

// 浏览器语言到应用语言的映射
const browserLanguageMap: Record<string, Language> = {
  'zh': 'zh',
  'zh-cn': 'zh',
  'zh-hans': 'zh',
  'zh-hans-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  'en': 'en',
  'en-us': 'en',
  'en-gb': 'en',
  'en-ca': 'en',
  'en-au': 'en',
  'ru': 'ru',
  'ru-ru': 'ru',
  'fr': 'fr',
  'fr-fr': 'fr',
  'fr-ca': 'fr',
  'ja': 'ja',
  'ja-jp': 'ja',
  'it': 'it',
  'it-it': 'it',
  'ko': 'ko',
  'ko-kr': 'ko',
  'de': 'de',
  'de-de': 'de',
  'de-at': 'de',
  'de-ch': 'de',
  'es': 'es',
  'es-es': 'es',
  'es-mx': 'es',
  'es-ar': 'es'
};

// 检测浏览器语言
export const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLanguages = navigator.languages || [navigator.language];
  
  for (const lang of browserLanguages) {
    const normalizedLang = lang.toLowerCase().replace('_', '-');
    const mappedLang = browserLanguageMap[normalizedLang];
    if (mappedLang) {
      return mappedLang;
    }
  }
  
  return 'en'; // 默认返回英语
};

export const getTranslations = (language: Language) => {
  switch (language) {
    case 'zh':
      return zhTranslations;
    case 'ru':
      return ruTranslations;
    case 'fr':
      return frTranslations;
    case 'ja':
      return jaTranslations;
    case 'it':
      return itTranslations;
    case 'ko':
      return koTranslations;
    case 'de':
      return deTranslations;
    case 'es':
      return esTranslations;
    case 'en':
    default:
      return enTranslations;
  }
};

export { 
  zhTranslations, 
  enTranslations, 
  ruTranslations, 
  frTranslations, 
  jaTranslations, 
  itTranslations, 
  koTranslations, 
  deTranslations, 
  esTranslations 
};


