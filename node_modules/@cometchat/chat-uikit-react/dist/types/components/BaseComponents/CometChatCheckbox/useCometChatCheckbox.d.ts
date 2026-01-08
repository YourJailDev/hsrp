import { ChangeEvent } from "react";
export declare const useCometChatCheckbox: ({ checked, onCheckBoxValueChanged }: {
    checked?: boolean | undefined;
    onCheckBoxValueChanged?: ((input: {
        checked: boolean;
        labelText: string | undefined;
    }) => void) | undefined;
}) => {
    isChecked: boolean;
    updateCheckbox: (event: ChangeEvent<HTMLInputElement>) => void;
};
