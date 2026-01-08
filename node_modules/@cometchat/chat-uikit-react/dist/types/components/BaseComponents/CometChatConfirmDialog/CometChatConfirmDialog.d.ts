interface ConfirmDialogProps {
    /** The title displayed at the top of the confirm dialog. */
    title?: string;
    /** The descriptive text inside the confirm dialog. */
    messageText?: string;
    /** The text displayed on the "cancel" button. */
    cancelButtonText?: string;
    /** The text displayed on the "confirm" button. */
    confirmButtonText?: string;
    /** Callback function for when the confirm button is clicked. */
    onSubmitClick?: () => Promise<void>;
    /** Callback function for when the cancel button is clicked. */
    onCancelClick?: () => void;
}
declare const CometChatConfirmDialog: (props: ConfirmDialogProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatConfirmDialog };
