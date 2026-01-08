import React from 'react';
/**
 * Interface for the props of CometChatToast component
 */
interface CometChatToastProps {
    /** The text to display in the toast message */
    text: string;
    /** Duration (in milliseconds) for which the toast is visible (default is 3000ms) */
    duration?: number;
    /** Optional callback function that executes when the toast closes */
    onClose?: () => void;
}
/**
 * CometChatToast Component
 *
 * This component displays a temporary toast message with a specified text and duration.
 * The toast will automatically disappear after the specified duration and optionally trigger
 * an `onClose` callback if provided.
 *
 * @param {string} text - The message text to display in the toast
 * @param {number} duration - Duration for which the toast is visible
 * @param {function} onClose - Callback function executed when the toast closes
 *
 * @returns {JSX.Element | null} - The JSX element for the toast message or null if no text is provided
 */
declare const CometChatToast: React.FC<CometChatToastProps>;
export default CometChatToast;
