export type SupportedLanguage = 'en' | 'es' | 'ja' | 'de' | 'fr';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export interface Translations {
  [key: string]: TranslationKey;
}