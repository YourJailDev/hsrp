interface ImageBubbleProps {
    src: string;
    placeholderImage?: string;
    onImageClicked?: (input: {
        src: string;
    }) => void;
    isSentByMe?: boolean;
    disableLoadingState?: boolean;
}
declare const CometChatImageBubble: (props: ImageBubbleProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatImageBubble };
