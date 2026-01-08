import { ReactNode } from 'react';
import { MessageBubbleAlignment } from '../../../Enums/Enums';
import { CometChatTextFormatter } from '../../../formatters/CometChatFormatters/CometChatTextFormatter';
interface IMessageTranslationBubbleProps {
    /**
     * The text that has been translated.
     */
    translatedText: string;
    /**
     * The alignment of the message bubble (left or right).
     */
    alignment: MessageBubbleAlignment;
    /**
     * Optional help text to display below the translated text.
     * Defaults to a localized message.
     */
    helpText?: string;
    /**
     * Optional array of text formatters to apply to the translated text.
     */
    textFormatters?: Array<CometChatTextFormatter>;
    /**
     * Optional React children to render inside the bubble.
     */
    children?: ReactNode;
    isSentByMe?: boolean;
}
/**
 * Renders a message translation bubble that displays translated text with optional formatting and help text.
 *
 * @param {IMessageTranslationBubbleProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component or null if no translated text is provided.
 */
declare const MessageTranslationBubble: (props: IMessageTranslationBubbleProps) => import("react/jsx-runtime").JSX.Element | null;
export { MessageTranslationBubble };
