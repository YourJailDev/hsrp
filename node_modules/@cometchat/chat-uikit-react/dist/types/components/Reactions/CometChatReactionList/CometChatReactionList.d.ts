import React from "react";
interface ReactionListProps {
    messageObject: CometChat.BaseMessage;
    reactionsRequestBuilder?: CometChat.ReactionsRequestBuilder;
    reactionItemClicked?: (reaction: CometChat.Reaction, message: CometChat.BaseMessage) => void;
    onError?: ((error: CometChat.CometChatException) => void) | null;
}
export declare const CometChatReactionList: React.FC<ReactionListProps>;
export {};
