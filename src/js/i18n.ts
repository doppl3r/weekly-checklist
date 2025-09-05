import { createI18n } from 'vue-i18n';
import en from '../json/i18n/en.json';
import { Settings } from '../types/types';

// vue-i18n expects messages to be Record<string, LocaleMessageObject>
// en.json is assumed to be an object with string keys and string values
const settings: Settings = JSON.parse(localStorage.getItem('settings') || '{}');

const messages = {
  en: en
};

const i18n = createI18n({
  legacy: false,
  locale: settings.language || 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;