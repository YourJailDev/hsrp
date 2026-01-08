import React from "react";
import { MessageBubbleAlignment } from "../../../Enums/Enums";
interface ReactionsProps {
    messageObject: CometChat.BaseMessage;
    alignment?: MessageBubbleAlignment;
    reactionsRequestBuilder?: CometChat.ReactionsRequestBuilder;
    onReactionListItemClick?: (reaction: CometChat.Reaction, message: CometChat.BaseMessage) => void;
    hoverDebounceTime?: number;
    onReactionClick?: (reaction: CometChat.ReactionCount, message: CometChat.BaseMessage) => void;
    onError?: ((error: CometChat.CometChatException) => void) | null;
}
export declare const CometChatReactions: React.FC<ReactionsProps>;
export {};
