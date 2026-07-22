import { messages } from './messages';

export const languages = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

export function getMessage(locale, key) {
  return messages[locale]?.[key] ?? messages.en[key] ?? key;
}
