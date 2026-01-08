import React from "react";
import { Placement } from "../../../Enums/Enums";
interface ReactionInfoProps {
    messageObject: CometChat.BaseMessage;
    reaction: string;
    placement?: Placement;
    onError?: ((error: CometChat.CometChatException) => void) | null;
}
export declare const CometChatReactionInfo: React.FC<ReactionInfoProps>;
export {};
