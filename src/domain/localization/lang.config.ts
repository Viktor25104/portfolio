export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'EN' },
  { code: 'uk', name: 'UA' },
  { code: 'ru', name: 'RU' }
] as const;

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0].code;
