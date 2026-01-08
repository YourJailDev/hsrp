import { CometChatTextFormatter } from "../../../formatters/CometChatFormatters/CometChatTextFormatter";
interface TextBubbleProps {
    text: string;
    textFormatters?: Array<CometChatTextFormatter>;
    isSentByMe?: boolean;
}
declare const CometChatTextBubble: (props: TextBubbleProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatTextBubble };
