interface SearchBarProps {
    searchText?: string;
    placeholderText?: string;
    onChange?: (input: {
        value?: string;
    }) => void;
}
declare const CometChatSearchBar: (props: SearchBarProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatSearchBar };
