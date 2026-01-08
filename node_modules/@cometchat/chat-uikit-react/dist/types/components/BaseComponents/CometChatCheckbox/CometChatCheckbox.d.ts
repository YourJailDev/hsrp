interface CheckboxProps {
    checked?: boolean;
    labelText?: string;
    disabled?: boolean;
    onCheckBoxValueChanged: (input: {
        checked: boolean;
        labelText: string | undefined;
    }) => void;
}
declare const CometChatCheckbox: (props: CheckboxProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatCheckbox };
