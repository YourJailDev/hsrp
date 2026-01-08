import React from "react";
interface MediaRecorderProps {
    autoRecording?: boolean;
    onCloseRecording?: () => void;
    onSubmitRecording?: (file: Blob) => void;
}
declare const CometChatMediaRecorder: React.FC<MediaRecorderProps>;
export { CometChatMediaRecorder };
