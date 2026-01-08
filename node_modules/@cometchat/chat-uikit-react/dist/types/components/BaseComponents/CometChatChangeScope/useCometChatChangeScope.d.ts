export declare const useCometChatChangeScope: ({ defaultSelection, }: {
    defaultSelection?: string | undefined;
}) => {
    selectedValue: string;
    selectionChanged: (input: {
        checked: boolean;
        labelText: string | undefined;
        id: string;
    }) => void;
};
