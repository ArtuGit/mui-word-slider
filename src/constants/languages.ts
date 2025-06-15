// Language mapping for speech synthesis
export const LANGUAGE_MAP: Record<string, string> = {
    polish: 'pl-PL',
    english: 'en-US',
    spanish: 'es-ES',
    french: 'fr-FR',
    german: 'de-DE',
    italian: 'it-IT',
    portuguese: 'pt-PT',
    russian: 'ru-RU',
    chinese: 'zh-CN',
    japanese: 'ja-JP',
    korean: 'ko-KR',
    arabic: 'ar-SA',
    hindi: 'hi-IN',
    dutch: 'nl-NL',
    swedish: 'sv-SE',
    norwegian: 'no-NO',
    danish: 'da-DK',
    finnish: 'fi-FI',
};
// Supported languages list
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAP);

export const SUPPORTED_LANGUAGES_NAMES = SUPPORTED_LANGUAGES
    .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1))
    .sort();