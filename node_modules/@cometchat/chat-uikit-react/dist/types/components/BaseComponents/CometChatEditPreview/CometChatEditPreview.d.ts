import { FC } from 'react';
/**
 * Interface for the props used in the CometChatEditPreview component.
 */
interface EditPreviewProps {
    /** The title to display in the preview, defaults to "Edit Message"*/
    previewTitle?: string;
    /** The subtitle to display in the preview, can be left empty. */
    previewSubtitle?: string;
    /** Callback function that triggers when the close button is clicked. */
    onClose?: () => void;
}
/**
 * CometChatEditPreview Component
 *
 * A React component that displays a preview of an edited message with a title and subtitle.
 * @param {EditPreviewProps} props - The props for the component.
 * @returns {JSX.Element} A JSX element displaying the edit preview UI.
 */
declare const CometChatEditPreview: FC<EditPreviewProps>;
export { CometChatEditPreview };
