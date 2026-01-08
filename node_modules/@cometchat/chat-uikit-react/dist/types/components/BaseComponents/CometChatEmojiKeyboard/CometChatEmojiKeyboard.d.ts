import { CometChatEmojiCategory } from "./CometChatEmoji";
interface EmojiKeyboardProps {
    emojiData?: CometChatEmojiCategory[];
    onEmojiClick?: (emoji: string) => void;
}
declare const CometChatEmojiKeyboard: (props: EmojiKeyboardProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatEmojiKeyboard };
