import React from "react";
import { DivElementRef } from "./CometChatList";
type Args = {
    intersectionObserverRootRef: React.MutableRefObject<DivElementRef>;
    intersectionObserverBottomTargetRef: React.MutableRefObject<DivElementRef>;
    intersectionObserverTopTargetRef: React.MutableRefObject<DivElementRef>;
    onScrolledToBottomRef: React.MutableRefObject<(() => void) | undefined>;
    onScrolledToTopRef: React.MutableRefObject<(() => void) | undefined>;
    scrollToBottom: boolean;
    didComponentScrollToBottomRef: React.MutableRefObject<boolean>;
    scrollHeightTupleRef: React.MutableRefObject<[number, number]>;
    didTopObserverCallbackRunRef: React.MutableRefObject<boolean>;
    errorHandler: (error: unknown) => void;
    scrolledUpCallback?: (boolean?: boolean) => void;
};
export declare function useCometChatList(args: Args): void;
export {};
