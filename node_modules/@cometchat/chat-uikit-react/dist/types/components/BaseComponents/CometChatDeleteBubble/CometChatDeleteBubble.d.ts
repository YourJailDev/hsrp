interface DeleteBubbleProps {
    isSentByMe: boolean;
    /**
     * Optional. The text to display. If not provided, a default
     * localized "DELETE_MSG_TEXT" will be used.
     */
    text?: string;
}
/**
 * CometChatDeleteBubble is a generic component used to indicate that a message has been deleted.
 * It accepts the isSentByMe prop and applies sender or receiver styling based on its value.
 */
declare const CometChatDeleteBubble: (props: DeleteBubbleProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatDeleteBubble };
