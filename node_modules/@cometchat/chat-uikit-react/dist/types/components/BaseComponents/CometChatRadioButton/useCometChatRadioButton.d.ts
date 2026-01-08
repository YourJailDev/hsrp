import { ChangeEvent } from "react";
export declare const useCometChatRadioButton: ({ checked, onRadioButtonChanged, id, name, }: {
    checked?: boolean | undefined;
    onRadioButtonChanged?: ((input: {
        checked: boolean;
        labelText: string | undefined;
        id: string;
    }) => void) | undefined;
    id?: string | undefined;
    name?: string | undefined;
}) => {
    updateRadioState: (event: ChangeEvent<HTMLInputElement>) => void;
};
