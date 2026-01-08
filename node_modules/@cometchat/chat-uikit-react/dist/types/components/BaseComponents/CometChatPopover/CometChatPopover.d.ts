import { ReactNode } from 'react';
export declare enum Placement {
    top = "top",
    right = "right",
    bottom = "bottom",
    left = "left"
}
interface PopoverProps {
    placement?: Placement;
    closeOnOutsideClick?: boolean;
    showOnHover?: boolean;
    debounceOnHover?: number;
    children: ReactNode;
    content: ReactNode;
    childClickHandler?: (openContent: Function, event: Event) => void;
    onOutsideClick?: () => void;
    disableBackgroundInteraction?: boolean;
    useParentContainer?: boolean;
    useParentHeight?: boolean;
    showTooltip?: boolean;
}
declare const CometChatPopover: import("react").ForwardRefExoticComponent<PopoverProps & import("react").RefAttributes<{
    openPopover: () => void;
    closePopover: () => void;
}>>;
export { CometChatPopover };
