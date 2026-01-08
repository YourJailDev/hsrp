interface BaseProps {
    /** Name used for displaying initials in the avatar. */
    name?: string;
    /** URL of the avatar image to be displayed. */
    image?: string;
}
type CometChatAvatarProps = BaseProps & {
    name: string;
} | BaseProps & {
    image: string;
};
declare const CometChatAvatar: (props: CometChatAvatarProps) => import("react/jsx-runtime").JSX.Element;
export { CometChatAvatar };
