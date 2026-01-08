import { ChangeEvent } from "react";
export declare const useCometChatSearchBar: ({ searchText, onChange, }: {
    searchText?: string | undefined;
    onChange?: (({ value: string }: {
        value?: string | undefined;
    }) => void) | undefined;
}) => {
    searchValue: string;
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
