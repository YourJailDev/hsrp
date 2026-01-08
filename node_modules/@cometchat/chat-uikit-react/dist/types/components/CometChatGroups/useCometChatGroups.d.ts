import React from "react";
import { Action } from "./CometChatGroups";
import { GroupsManager } from "./controller";
type Args = {
    groupsRequestBuilder: CometChat.GroupsRequestBuilder | null;
    searchRequestBuilder: CometChat.GroupsRequestBuilder | null;
    searchText: string;
    fetchNextIdRef: React.MutableRefObject<string>;
    groupsManagerRef: React.MutableRefObject<GroupsManager | null>;
    dispatch: React.Dispatch<Action>;
    fetchNextAndAppendGroups: (fetchId: string) => Promise<void>;
    groupsSearchText: React.MutableRefObject<string>;
    errorHandler: (error: unknown, source?: string | undefined) => void;
};
export declare function useCometChatGroups(args: Args): void;
export {};
