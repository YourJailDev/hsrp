import { MouseEvent } from "react";
export declare const useCometChatDropDown: ({ selectedOption, onOptionsChanged, }: {
    selectedOption?: string | undefined;
    onOptionsChanged?: (({ value: string }: {
        value?: string | undefined;
    }) => void) | undefined;
}) => {
    selectedOptionState: string;
    dropdownVisible: boolean;
    onButtonClick: (event: MouseEvent<HTMLButtonElement>) => void;
    onOptionClick: (selectedOption: string) => void;
};
