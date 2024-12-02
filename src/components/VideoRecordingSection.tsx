import React from 'react';
import { Card } from "@/components/ui/card";
import VideoRecordingControls from './VideoRecordingControls';
import Countdown from './Countdown';

interface VideoRecordingSectionProps {
  isRecording: boolean;
  recordedVideo: Blob | null;
  countdown: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onResetRecording: () => void;
}

const VideoRecordingSection: React.FC<VideoRecordingSectionProps> = ({
  isRecording,
  recordedVideo,
  countdown,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onResetRecording
}) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="aspect-video bg-black/5 rounded-lg overflow-hidden">
        {recordedVideo ? (
          <video
            className="w-full h-full object-cover"
            src={URL.createObjectURL(recordedVideo)}
            controls={!isRecording}
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        )}
      </div>
      <VideoRecordingControls
        isRecording={isRecording}
        recordedVideo={recordedVideo}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPlayRecording={onPlayRecording}
        onResetRecording={onResetRecording}
      />
      <Countdown count={countdown} />
    </Card>
  );
};

export default VideoRecordingSection;