import React from 'react';
import { Button } from "@/components/ui/button";
import { Video, Square, Play, RotateCcw } from "lucide-react";

interface VideoRecordingControlsProps {
  isRecording: boolean;
  recordedVideo: Blob | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onResetRecording: () => void;
}

const VideoRecordingControls: React.FC<VideoRecordingControlsProps> = ({
  isRecording,
  recordedVideo,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onResetRecording
}) => {
  return (
    <div className="flex justify-center gap-4">
      {!isRecording && !recordedVideo && (
        <Button
          size="lg"
          onClick={onStartRecording}
          className="animate-scale-up"
        >
          <Video className="mr-2 h-5 w-5" />
          Start Video Recording
        </Button>
      )}
      
      {isRecording && (
        <Button
          size="lg"
          variant="destructive"
          onClick={onStopRecording}
          className="animate-pulse"
        >
          <Square className="mr-2 h-5 w-5" />
          Stop Recording
        </Button>
      )}
      
      {recordedVideo && !isRecording && (
        <>
          <Button size="lg" onClick={onPlayRecording}>
            <Play className="mr-2 h-5 w-5" />
            Play Recording
          </Button>
          <Button size="lg" variant="outline" onClick={onResetRecording}>
            <RotateCcw className="mr-2 h-5 w-5" />
            New Recording
          </Button>
        </>
      )}
    </div>
  );
};

export default VideoRecordingControls;