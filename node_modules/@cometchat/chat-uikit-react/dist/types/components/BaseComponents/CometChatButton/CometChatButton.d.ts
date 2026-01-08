interface ButtonProps {
    text?: string;
    hoverText?: string;
    iconURL?: string;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: (customEvent: CustomEvent<{
        event: PointerEvent;
    }>) => void;
}
declare const CometChatButton: (props: ButtonProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatButton };
