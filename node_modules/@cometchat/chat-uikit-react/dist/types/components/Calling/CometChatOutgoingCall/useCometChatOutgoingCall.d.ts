/**
 * Custom hook to handle outgoing call actions like playing audio and pausing it when necessary.
 * @param playAudio - Function to play audio during the outgoing call.
 * @param call - Optional CometChat.Call object representing the outgoing call.
 */
declare function useCometChatOutgoingCall(errorHandler: (error: unknown, source?: string) => void, playAudio: Function, call?: CometChat.Call): void;
export { useCometChatOutgoingCall };
