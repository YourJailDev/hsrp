type Args = {
    searchText: string;
    usersRequestBuilder: CometChat.UsersRequestBuilder | null;
    searchRequestBuilder: CometChat.UsersRequestBuilder | null;
    usersSearchText: React.MutableRefObject<string>;
};
export declare class UsersManager {
    private usersRequest;
    private static defaultLimit;
    /**
     * Set `usersRequest` of the instance
     */
    constructor(args: Args);
    private getDefaultRequestBuilder;
    /**
     * Calls `fetchNext` method of the set `usersRequest`
     */
    fetchNext(): Promise<[] | import("@cometchat/chat-sdk-javascript").User[]>;
    getCurrentPage(): number;
    /**
* Attaches an SDK websocket  listener
*
* @returns - Function to remove the added SDK websocket listener
*/
    static attachConnestionListener(callback: () => void): () => void;
}
export {};
