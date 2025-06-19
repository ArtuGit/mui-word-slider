/**
 * Speech Service using Web Speech API
 * Provides text-to-speech functionality with language support
 */
import { LANGUAGE_MAP, SUPPORTED_LANGUAGES } from '../constants/languages.ts';

interface SpeechOptions {
  language: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class SpeechService {
  private static synthesis: SpeechSynthesis | null = null;
  private static isSupported: boolean | null = null;

  /**
   * Check if Web Speech API is supported
   */
  static isSpeechSupported(): boolean {
    if (this.isSupported === null) {
      this.isSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    }
    return this.isSupported;
  }

  /**
   * Check if a specific language is supported with actual voices available
   */
  static isLanguageSupported(language: string): boolean {
    if (!language || typeof language !== 'string') {
      return false;
    }

    if (!this.isSpeechSupported()) {
      return false;
    }

    const synthesis = this.getSynthesis();
    if (!synthesis) {
      return false;
    }

    // Get all available voices
    const voices = synthesis.getVoices();
    if (voices.length === 0) {
      return false;
    }

    // Use the improved voice matching
    const availableVoices = this.getVoicesForLanguage(language);
    return availableVoices.length > 0;
  }

  /**
   * Get the speech synthesis instance
   */
  private static getSynthesis(): SpeechSynthesis | null {
    if (!this.isSpeechSupported()) {
      return null;
    }

    if (!this.synthesis) {
      this.synthesis = window.speechSynthesis;
    }
    return this.synthesis;
  }

  /**
   * Get available voices for a specific language
   */
  static getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const synthesis = this.getSynthesis();
    if (!synthesis) return [];

    const voices = synthesis.getVoices();
    const languageCode = this.getLanguageCode(language);

    // Try exact language match first (e.g., 'pl-PL')
    let matchingVoices = voices.filter(
      voice => voice.lang.toLowerCase() === languageCode.toLowerCase()
    );

    // If no exact match, try language prefix (e.g., 'pl')
    if (matchingVoices.length === 0) {
      const langPrefix = languageCode.toLowerCase().substring(0, 2);
      matchingVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith(langPrefix));
    }

    return matchingVoices;
  }

  /**
   * Convert language name to language code
   */
  private static getLanguageCode(language: string): string {
    // Handle undefined, null, or empty language
    if (!language || typeof language !== 'string') {
      return 'en-US'; // Default to English with proper format
    }

    const normalizedLanguage = language.toLowerCase().trim();

    // First try exact match
    if (LANGUAGE_MAP[normalizedLanguage]) {
      return LANGUAGE_MAP[normalizedLanguage];
    }

    // Try partial matches for common variations
    if (normalizedLanguage.includes('polish') || normalizedLanguage.includes('pol')) {
      return 'pl-PL';
    }
    if (normalizedLanguage.includes('english') || normalizedLanguage.includes('eng')) {
      return 'en-US';
    }

    // If no match found, try to use the original string if it looks like a language code
    if (normalizedLanguage.match(/^[a-z]{2}(-[a-z]{2})?$/i)) {
      return normalizedLanguage;
    }

    // Default fallback
    return 'en-US';
  }

  /**
   * Speak the given text in the specified language
   */
  static speak(text: string, options: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const synthesis = this.getSynthesis();

      if (!synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Validate inputs
      if (!text || typeof text !== 'string') {
        reject(new Error('Invalid text provided for speech'));
        return;
      }

      if (!options.language) {
        reject(new Error('Language is required for speech synthesis'));
        return;
      }

      // Cancel any ongoing speech
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const languageCode = this.getLanguageCode(options.language);

      // Set utterance properties
      utterance.lang = languageCode;
      utterance.rate = options.rate ?? 0.9; // Slightly slower for better pronunciation
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      // Try to find a voice for the language
      const voices = this.getVoicesForLanguage(options.language);
      if (voices.length > 0) {
        // Prefer native voices over non-native ones
        const nativeVoice = voices.find(voice => !voice.name.includes('Google'));
        utterance.voice = nativeVoice || voices[0];
      }

      // Set up event handlers
      utterance.onend = () => resolve();
      utterance.onerror = event => reject(new Error(`Speech error: ${event.error}`));

      // Speak the text
      synthesis.speak(utterance);
    });
  }

  /**
   * Stop any ongoing speech
   */
  static stop(): void {
    const synthesis = this.getSynthesis();
    if (synthesis) {
      synthesis.cancel();
    }
  }

  /**
   * Check if speech is currently playing
   */
  static isSpeaking(): boolean {
    const synthesis = this.getSynthesis();
    return synthesis ? synthesis.speaking : false;
  }

  /**
   * Pause ongoing speech
   */
  static pause(): void {
    const synthesis = this.getSynthesis();
    if (synthesis && synthesis.speaking) {
      synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  static resume(): void {
    const synthesis = this.getSynthesis();
    if (synthesis && synthesis.paused) {
      synthesis.resume();
    }
  }
}

export const speechService = {
  speak: SpeechService.speak.bind(SpeechService),
  stop: SpeechService.stop.bind(SpeechService),
  isSpeaking: SpeechService.isSpeaking.bind(SpeechService),
  isSupported: SpeechService.isSpeechSupported.bind(SpeechService),
  isLanguageSupported: SpeechService.isLanguageSupported.bind(SpeechService),
  pause: SpeechService.pause.bind(SpeechService),
  resume: SpeechService.resume.bind(SpeechService),
  supportedLanguages: SUPPORTED_LANGUAGES,
};
