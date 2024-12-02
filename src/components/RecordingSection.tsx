import React from 'react';
import { Card } from "@/components/ui/card";
import AudioVisualizer from './AudioVisualizer';
import RecordingControls from './RecordingControls';

interface RecordingSectionProps {
  audioData: Float32Array | null;
  isRecording: boolean;
  recordedAudio: Blob | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onResetRecording: () => void;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({
  audioData,
  isRecording,
  recordedAudio,
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
    </Card>
  );
};

export default RecordingSection;