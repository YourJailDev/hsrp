export declare class CometChatEmoji {
    char: string;
    keywords: any;
    constructor({ char, keywords }: {
        char?: string | undefined;
        keywords?: never[] | undefined;
    });
}
export declare class CometChatEmojiCategory {
    id: string;
    symbolURL: string;
    name: string;
    emojies: {
        [key: string]: CometChatEmoji;
    };
    constructor({ id, symbolURL, name, emojies, }: {
        id?: string | undefined;
        symbolURL?: string | undefined;
        name?: string | undefined;
        emojies?: {} | undefined;
    });
}
