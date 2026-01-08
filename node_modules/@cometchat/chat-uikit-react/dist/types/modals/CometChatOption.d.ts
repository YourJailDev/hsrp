/**
 * Defines an option for message actions like edit or delete.
 * Allows customization of text, icon, and click behavior.
 * It is used in CometChatConversations, CometChatGroupMembers, CometChatGroups, CometChatUsers components.
 */
export declare class CometChatOption {
    /** Unique identifier for the option. */
    id?: string;
    /** Text label for the option. */
    title?: string;
    /** URL of the icon representing the option. */
    iconURL?: string;
    /** Function to be called when the option is clicked. */
    onClick?: any;
    /**
     * Creates a new CometChatOption instance.
     * @param {Partial<CometChatOption>} props - Properties to initialize the option.
     */
    constructor(props: Partial<CometChatOption>);
}
