import { CometChatTextFormatter } from "../CometChatTextFormatter";
/**
 * Class that handles the text formatting for URLs in CometChat.
 * CometChatUrlsFormatter is a child class of CometChatTextFormatter.
 * It extends the functionality of text formatting to specifically handle URLs.
 * It is used in extension decorators like  link preview, message translation, and dataSource utils.
 */
export declare class CometChatUrlsFormatter extends CometChatTextFormatter {
    constructor(regexPatterns: Array<RegExp>);
    protected onRegexMatch(inputText?: string | null): string;
    registerEventListeners(element: HTMLElement, classList: DOMTokenList): HTMLElement;
}
