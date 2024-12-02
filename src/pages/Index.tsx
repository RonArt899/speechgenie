import React from 'react';
import Header from '@/components/Header';
import RecordingSection from '@/components/RecordingSection';
import VideoRecordingSection from '@/components/VideoRecordingSection';
import SpeechFeedback from '@/components/SpeechFeedback';
import VideoFeedback from '@/components/VideoFeedback';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useVideoRecording } from '@/hooks/useVideoRecording';

const Index = () => {
  const {
    isRecording,
    audioData,
    recordedAudio,
    feedback,
    countdown,
    startRecording,
    stopRecording,
    playRecording,
    resetRecording
  } = useAudioRecording();

  const {
    isRecording: isRecordingVideo,
    recordedVideo,
    feedback: videoFeedback,
    countdown: videoCountdown,
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    playRecording: playVideoRecording,
    resetRecording: resetVideoRecording
  } = useVideoRecording();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Audio Recording</h2>
            <RecordingSection
              audioData={audioData}
              isRecording={isRecording}
              recordedAudio={recordedAudio}
              countdown={countdown}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPlayRecording={playRecording}
              onResetRecording={resetRecording}
            />
            {feedback && <SpeechFeedback feedback={feedback} />}
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Video Recording</h2>
            <VideoRecordingSection
              isRecording={isRecordingVideo}
              recordedVideo={recordedVideo}
              countdown={videoCountdown}
              onStartRecording={startVideoRecording}
              onStopRecording={stopVideoRecording}
              onPlayRecording={playVideoRecording}
              onResetRecording={resetVideoRecording}
            />
            {videoFeedback && <VideoFeedback feedback={videoFeedback} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;