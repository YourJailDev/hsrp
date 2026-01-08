import { CalendarObject } from "../../../utils/CalendarObject";
interface DateProps {
    timestamp: number;
    calendarObject: CalendarObject;
}
/**
 * CometChatDate is a generic component used to display dates in the required format.
 * It accepts a timestamp of the time to be displayed and the pattern in which the time should be displayed.
 * It also accepts the customDateString prop, whose value is used as is for displaying the time.
 */
declare const CometChatDate: (props: DateProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatDate };
