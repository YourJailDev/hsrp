import { ExtensionsDataSource } from '../Extensions/ExtensionsDataSource';
import { CallingConfiguration } from './CallingConfiguration';
export declare class CallingExtension extends ExtensionsDataSource {
    private configuration?;
    constructor(configuration?: CallingConfiguration);
    enable(): void;
    addExtension(): void;
    getExtensionId(): string;
}
