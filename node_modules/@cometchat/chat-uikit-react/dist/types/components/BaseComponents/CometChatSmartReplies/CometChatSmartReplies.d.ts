interface CometChatSmartRepliesProps {
    getSmartReplies?: () => Promise<string[]>;
    onSuggestionClicked?: (reply: string) => void;
    closeCallback?: () => void;
}
declare const CometChatSmartReplies: (props: CometChatSmartRepliesProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatSmartReplies };
