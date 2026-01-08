import { CometChatUIKitCalls } from "../../../CometChatUIKit/CometChatCalls";
import { CallWorkflow } from "../../../Enums/Enums";
interface OngoingCallProps {
    callSettingsBuilder?: typeof CometChatUIKitCalls.CallSettings;
    sessionID: string;
    onError?: Function;
    callWorkflow?: CallWorkflow;
}
declare const CometChatOngoingCall: (props: OngoingCallProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatOngoingCall };
