import { CometChatActionsView, CometChatMessageComposerAction } from "../../../modals";
interface ActionSheetProps {
    actions: (CometChatMessageComposerAction | CometChatActionsView)[];
    onActionItemClick: (action: CometChatMessageComposerAction | CometChatActionsView) => void;
}
declare const CometChatActionSheet: (props: ActionSheetProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatActionSheet };
