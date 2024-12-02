import React from 'react';
import { Card } from "@/components/ui/card";
import AudioVisualizer from './AudioVisualizer';
import RecordingControls from './RecordingControls';
import Countdown from './Countdown';

interface RecordingSectionProps {
  audioData: Float32Array | null;
  isRecording: boolean;
  recordedAudio: Blob | null;
  countdown: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onResetRecording: () => void;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({
  audioData,
  isRecording,
  recordedAudio,
  countdown,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onResetRecording
}) => {
  return (
    <Card className="p-6 space-y-6">
      <AudioVisualizer audioData={audioData} />
      <RecordingControls
        isRecording={isRecording}
        recordedAudio={recordedAudio}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPlayRecording={onPlayRecording}
        onResetRecording={onResetRecording}
      />
      <Countdown count={countdown} />
    </Card>
  );
};

export default RecordingSection;