import { MessageBubbleAlignment } from "../../../Enums/Enums";
export interface PollOptions {
    id: string;
    selectedByLoggedInUser?: boolean;
    text: string;
    votersObj?: CometChat.User[];
    count: number;
    percent: string;
}
interface PollsBubbleProps {
    /**
     * Array of options for the poll.
     */
    options?: PollOptions[];
    /**
     * The question being asked in the poll.
     */
    pollQuestion: string;
    /**
     * The unique identifier for the poll.
     */
    pollId: string | number;
    /**
     * The currently logged-in user.
     * Optional.
     */
    loggedInUser: CometChat.User | undefined;
    /**
     * The unique identifier of the sender of the poll.
     */
    senderUid: string;
    /**
     * Optional metadata associated with the poll.
     */
    metadata?: any;
    /**
     * ALignemtn of the message bubble
     */
    alignment?: MessageBubbleAlignment;
}
/**
 * PollsBubble component that displays a poll question and options.
 *
 * @param {PollsBubbleProps} props - The props for the component.
 * @returns {JSX.Element} The rendered PollsBubble component.
 */
declare const PollsBubble: (props: PollsBubbleProps) => import("react/jsx-runtime").JSX.Element;
export { PollsBubble };
