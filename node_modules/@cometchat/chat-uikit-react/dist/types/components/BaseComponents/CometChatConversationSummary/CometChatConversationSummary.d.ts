interface CometChatConversationSummaryProps {
    getConversationSummary?: () => Promise<string>;
    closeCallback?: () => void;
}
declare const CometChatConversationSummary: (props: CometChatConversationSummaryProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatConversationSummary };
