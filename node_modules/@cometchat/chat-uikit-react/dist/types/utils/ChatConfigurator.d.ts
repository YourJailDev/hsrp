import { DataSource } from "./DataSource";
/**
 * Class to initialize the cometchat datasource, to access getters and properties related to message components.
 * It is used in CometChatComposer, CometChatMessageComposer, CometChatMessageHeader, CometChatMessageList and AI module components.
 */
export declare class ChatConfigurator {
    static dataSource: DataSource;
    static names: Array<string>;
    static init(initialSource?: DataSource): void;
    static enable(callback: (dataSource: DataSource) => DataSource): void;
    static getDataSource(): DataSource;
}
