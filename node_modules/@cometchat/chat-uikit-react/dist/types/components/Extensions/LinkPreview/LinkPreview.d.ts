import React from 'react';
interface LinkPreviewProps {
    /**
     * URL of the link.
     */
    URL?: string;
    /**
     * Description of the link.
     */
    description?: string;
    /**
     * Title of the link.
     */
    title?: string;
    /**
     * URL of the image to display.
     */
    image?: string;
    /**
     * URL of the favicon to display.
     */
    favIconURL?: string;
    /**
     * Optional children to be displayed inside the link preview.
     */
    children?: React.ReactNode;
    /**
     * Function to handle click events on the link.
     */
    ccLinkClicked?: (url: string) => void;
    /**
     * boolean value to toggle styling for sender and receiver message
     */
    isSentByMe?: boolean;
}
declare const LinkPreview: (props: LinkPreviewProps) => import("react/jsx-runtime").JSX.Element;
export { LinkPreview };
