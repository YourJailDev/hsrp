interface DocumentBubbleProps {
    bannerImage: string;
    title: string;
    URL: string;
    subtitle: string;
    buttonText: string;
    isSentByMe?: boolean;
    onClicked: ((url: string) => void) | undefined;
}
declare const CometChatDocumentBubble: (props: DocumentBubbleProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatDocumentBubble };
