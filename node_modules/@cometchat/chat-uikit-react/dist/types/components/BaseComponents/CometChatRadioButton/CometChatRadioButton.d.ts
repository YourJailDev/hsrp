interface RadioButtonProps {
    checked?: boolean;
    name?: string;
    labelText?: string;
    disabled?: boolean;
    id?: string;
    onRadioButtonChanged?: (input: {
        checked: boolean;
        labelText: string | undefined;
        id: string;
    }) => void;
}
declare const CometChatRadioButton: (props: RadioButtonProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatRadioButton };
