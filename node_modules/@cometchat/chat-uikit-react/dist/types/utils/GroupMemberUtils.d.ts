import { CometChatOption } from "../modals";
/**
 * A utility class for handling group member-related actions and options within CometChat.
 * It is used in CometChatGroupMembers component.
 */
export declare class GroupMemberUtils {
    /**
     * Retrieves the available options for a given group member based on their role and the group's state.
     *
     * @param {CometChat.GroupMember} groupMember - The group member for whom the options are being fetched.
     * @param {CometChat.Group} group - The group to which the member belongs.
     * @param {string} [loggedInUser=""] - The UID of the logged-in user.
     * @returns {CometChatOption[] | string} - An array of options or the member's scope as a string.
     */
    static getViewMemberOptions(groupMember: CometChat.GroupMember, group: CometChat.Group, loggedInUser?: string, additionalConfigurations?: any): string | CometChatOption[];
    /**
     * Retrieves the available options for a banned group member.
     *
     * @param {CometChat.Group} group - The group to which the member belongs.
     * @param {CometChat.GroupMember} groupMember - The banned group member.
     * @returns {CometChatOption[]} - An array of options available for the banned group member.
     */
    static getBannedMemberOptions(group: CometChat.Group, groupMember: CometChat.GroupMember): CometChatOption[] | undefined;
    /**
     * Determines whether a scope change is allowed for a group member.
     *
     * @param {CometChat.Group} group - The group to which the member belongs.
     * @param {CometChat.GroupMember} groupMember - The group member whose scope is to be changed.
     * @returns {string[]} - An array of allowed scopes for the group member.
     */
    static allowScopeChange(group: CometChat.Group, groupMember: CometChat.GroupMember): string[];
}
