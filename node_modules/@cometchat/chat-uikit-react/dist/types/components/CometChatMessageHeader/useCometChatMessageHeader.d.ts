import React from "react";
declare function useCometChatMessageHeader(loggedInUser: CometChat.User | null, setLoggedInUser: Function, attachListeners: Function, userRef: React.MutableRefObject<CometChat.User | undefined>, groupRef: React.MutableRefObject<CometChat.Group | undefined>, updateSubtitle: Function, subscribeToEvents: Function, onErrorCallback: (error: unknown, source?: string | undefined) => void, user?: CometChat.User, group?: CometChat.Group, enableAutoSummaryGeneration?: boolean, loadConversationSummary?: Function): void;
export { useCometChatMessageHeader };
