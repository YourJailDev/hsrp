export declare class PollsConfiguration {
    private createPollIconURL;
    private deleteIconURL;
    private closeIconURL;
    private optionIconURL;
    private addAnswerIconURL;
    constructor(configuration: {
        createPollIconURL?: string;
        deleteIconURL?: string;
        closeIconURL?: string;
        optionIconURL?: string;
        addAnswerIconURL?: string;
    });
    getCreatePollIconURL(): string;
    getDeleteIconURL(): string;
    getCloseIconURL(): string;
    getOptionIconURL(): string;
    getAddAnswerIconURL(): string;
}
