import { ReactNode } from "react";
interface ListItemProps {
    id?: string;
    avatarURL?: string;
    avatarName?: string;
    title: string;
    onListItemClicked?: (input: {
        id?: string;
    }) => void;
    menuView?: ReactNode;
    subtitleView?: ReactNode;
    trailingView?: ReactNode;
    titleView?: ReactNode;
    leadingView?: ReactNode;
    stopEventPropagation?: boolean;
}
declare const CometChatListItem: (props: ListItemProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatListItem };
