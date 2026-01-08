import { Subject } from 'rxjs';
/**
 * Conversation event subjects for handling actions related to conversations (e.g., conversation deletion)
 */
export declare class CometChatConversationEvents {
    static ccConversationDeleted: Subject<CometChat.Conversation>;
    /**
      * Publishes a conversation event.
      * @param {Subject<CometChat.Conversation>} event - The event to publish.
      * @param {CometChat.Conversation} conversation - The conversation associated with the event.
      */
    static publishEvent(event: Subject<CometChat.Conversation>, conversation: CometChat.Conversation): void;
}
