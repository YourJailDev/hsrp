interface onOptionsChangedEvent {
    /** The value of the selected option from the dropdown. */
    value?: string;
}
interface DropDownProps {
    /** List of options to be displayed in the dropdown. */
    options: string[];
    /** Value from the list to be selected by default. */
    selectedOption?: string;
    /** Callback invoked when the dropdown selection changes. */
    onOptionsChanged?: (input: onOptionsChangedEvent) => void;
}
declare const CometChatDropDown: (props: DropDownProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatDropDown };
