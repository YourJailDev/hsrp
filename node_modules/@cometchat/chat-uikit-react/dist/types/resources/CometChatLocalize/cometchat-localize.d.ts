import { LocalizationSettings } from "../../utils/Interface";
import { CalendarObject } from "../../utils/CalendarObject";
/**
 * The `CometChatLocalize` class handles localization for the CometChat application.
 * It provides functionality to detect the user's browser language settings and
 * set the application's language accordingly.
 */
declare class CometChatLocalize {
    /** Properties and constants */
    static language: string;
    static fallbackLanguage: string;
    static timezone: string;
    static translations: {
        [key: string]: any;
    };
    static localizationSettings: LocalizationSettings;
    static calendarObject: CalendarObject;
    static disableAutoDetection: boolean;
    static disableDateTimeLocalization: boolean;
    private static defaultTimezones;
    /**
     * Adds custom translations to the default translations.
     * @param {object} resources - Custom translations object.
     */
    static addTranslation(resources: object): void;
    /**
     * Returns the browser language.
     * @returns {string} Browser language (e.g., "en-US").
     */
    static getBrowserLanguage(): string;
    /**
     * Localizes a given string based on the active language.
     * @param {string} str - String to localize.
     * @returns {string} Localized string.
     */
    static getLocalizedString: (str: string) => any;
    private static getDefaultTimeZone;
    /**
     * Initializes localization settings (v2).
     * @param {LocalizationSettings} settings - Localization settings.
     */
    static init(settings: LocalizationSettings): void;
    /**
     * Gets the current language.
     * @returns {string} Current language.
     */
    static getCurrentLanguage(): string;
    /**
     * Sets the current language.
     * @param {string} language - Language code to set.
     */
    static setCurrentLanguage(language: string): void;
    /**
     * @Returns the current language.
     */
    static getDefaultLanguage(): string;
    /**
     * @Returns the language to localize date.
     */
    static getDateLocaleLanguage(): string;
    /**
     * Formats a date using a given pattern.
     * @param {Date} date - Date to format.
     * @param {string} format - Format pattern.
     * @returns {string} Formatted date.
     */
    private static formatDateFromPattern;
    /**
     * Formats a timestamp based on the provided calendar configuration.
     * @param {number} timestamp - Timestamp to format.
     * @param {CalendarObject} calendarObject - Calendar configuration.
     * @returns {string} Formatted date string.
     */
    static formatDate(timestamp: number, calendarObject: CalendarObject): string;
    private static isYesterday;
}
declare const getLocalizedString: (str: string) => any;
export { CometChatLocalize, getLocalizedString };
