import { CometChatEmoji, CometChatEmojiCategory } from "./CometChatEmoji";
export declare const useCometChatEmojiKeyboard: ({ emojiData, }: {
    emojiData: CometChatEmojiCategory[];
}) => {
    emojiDataState: CometChatEmojiCategory[];
    activeCategory: string | undefined;
    setActiveCategory: import("react").Dispatch<import("react").SetStateAction<string | undefined>>;
    searchEmojiData: {
        [key: string]: CometChatEmoji;
    };
    searchString: string;
    getEmojiData: (emojiData: CometChatEmoji) => string;
    getEmojiCategory: () => void;
    scrollToElement: (id: string) => void;
    filterEmojis: (e: {
        value?: string;
    }) => void;
};
