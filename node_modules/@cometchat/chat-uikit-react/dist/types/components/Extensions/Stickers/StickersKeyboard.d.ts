interface StickersKeyboardProps {
    /**
     * Text to display when there is an error state.
     * @default "SOMETHING_WRONG"
     */
    errorStateText?: string;
    /**
     * Text to display when no stickers are found.
     * @default "NO_STICKERS_FOUND"
     */
    emptyStateText?: string;
    /**
     * Callback function triggered when a sticker is clicked.
     */
    ccStickerClicked: (event: {
        detail: {
            stickerURL: string;
            stickerName: string;
        };
    }) => void;
}
/**
 * A keyboard component that allows users to select and send stickers.
 * @component
 * @param {StickersKeyboardProps} props - The props for the component.
 * @returns {JSX.Element}
 */
declare const StickersKeyboard: (props: StickersKeyboardProps) => import("react/jsx-runtime").JSX.Element;
export { StickersKeyboard };
