import React from "react";
declare function useCallButtons(loggedInUser: any, setLoggedInUser: Function, user: any, group: any, errorHandler: Function, attachListeners: Function, removeListener: Function, setActiveUser: any, setActiveGroup: any, initiateAudioCall: Function, initiateVideoCall: Function, onVoiceCallClickRef: React.MutableRefObject<Function | undefined>, onVideoCallClickRef: React.MutableRefObject<Function | undefined>, subscribeToEvents: Function): {
    audioCallButtonClicked: () => void;
    videoCallButtonClicked: () => void;
};
export { useCallButtons };
