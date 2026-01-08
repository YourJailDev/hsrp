interface ChangeScopeProps {
    title?: string;
    buttonText?: string;
    options: string[];
    defaultSelection?: string;
    onScopeChanged?: (scope: string) => Promise<void>;
    onCloseClick?: () => void;
}
declare const CometChatChangeScope: (props: ChangeScopeProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatChangeScope };
