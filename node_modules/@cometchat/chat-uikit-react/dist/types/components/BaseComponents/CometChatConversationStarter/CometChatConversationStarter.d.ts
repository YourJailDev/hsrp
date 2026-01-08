interface CometChatConversationStarterProps {
    getConversationStarters?: () => Promise<string[]>;
    onSuggestionClicked?: (reply: string) => void;
}
declare const CometChatConversationStarter: (props: CometChatConversationStarterProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatConversationStarter };
