import React from "react";
interface CallBubbleProps {
    title?: string;
    sessionId?: string;
    subtitle?: React.ReactNode;
    buttonText?: string;
    iconURL?: string;
    onClicked?: ((url: string) => void) | undefined;
    isSentByMe?: boolean;
}
declare const CometChatCallBubble: (props: CallBubbleProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatCallBubble };
