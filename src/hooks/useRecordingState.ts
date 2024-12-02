import { useState } from 'react';

export const useRecordingState = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const startCountdown = (callback: () => void) => {
    setCountdown(5);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          callback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    isRecording,
    setIsRecording,
    countdown,
    feedback,
    setFeedback,
    startCountdown
  };
};