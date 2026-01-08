import { CometChatUIKitCalls } from "../../../CometChatUIKit/CometChatCalls";
import { OutgoingCallConfiguration } from "../OutgoingCallConfiguration";
interface CallButtonsProps {
    /**
     * Boolean flag to hide the video call button.
     */
    hideVideoCallButton?: boolean;
    /**
     * Boolean flag to hide the voice call button.
     */
    hideVoiceCallButton?: boolean;
    /**
     * Builder for checking and updating call settings.
     * @param isAudioOnlyCall - Whether it's an audio-only call.
     * @param user - The user object for the call (optional).
     * @param group - The group object for the call (optional).
     */
    callSettingsBuilder?: (isAudioOnlyCall: boolean, user?: CometChat.User, group?: CometChat.Group) => typeof CometChatUIKitCalls.CallSettingsBuilder;
    /**
     * Configuration object for managing outgoing call settings, such as call parameters, UI behaviors, or any pre-call settings.
     */
    outgoingCallConfiguration?: OutgoingCallConfiguration;
    /**
     * Callback function triggered when an error occurs in the call buttons component.
     * @param error - An instance of `CometChat.CometChatException` representing the error.
     * @returns void
     */
    onError?: ((error: CometChat.CometChatException) => void) | null;
}
interface CallButtonsUserProps extends CallButtonsProps {
    /**
     * A CometChat.User object representing the user in which the call will be initiated.
     */
    user?: CometChat.User;
    /**
     * A CometChat.Group object representing the group in which the call will be initiated.
     * @default null
     */
    group?: CometChat.Group | null;
}
interface CallButtonsGroupProps extends CallButtonsProps {
    /**
     * A CometChat.User object representing the user in which the call will be initiated.
     * @default null
     */
    user?: CometChat.User | null;
    /**
     * A CometChat.Group object representing the group in which the call will be initiated.
     */
    group?: CometChat.Group;
}
type CallButtonsPropsType = CallButtonsUserProps | CallButtonsGroupProps;
declare const CometChatCallButtons: (props: CallButtonsPropsType) => import("react/jsx-runtime").JSX.Element;
export { CometChatCallButtons };
