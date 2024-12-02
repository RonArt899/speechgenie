import { useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useRecordingState } from './useRecordingState';
import { useVideoAnalysis } from './useVideoAnalysis';

export const useVideoRecording = () => {
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const { 
    isRecording, 
    setIsRecording, 
    countdown, 
    feedback, 
    setFeedback, 
    startCountdown 
  } = useRecordingState();

  const { analyzeVideo } = useVideoAnalysis();

  const startRecording = async () => {
    startCountdown(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true 
        });
        
        videoStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);
        
        const chunks: BlobPart[] = [];
        mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.current.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          setRecordedVideo(blob);
          const result = await analyzeVideo(blob);
          if (result) setFeedback(result);
        };
        
        // Display preview
        const videoPreview = document.querySelector('video');
        if (videoPreview) {
          videoPreview.srcObject = stream;
        }
        
        mediaRecorder.current.start();
        setIsRecording(true);
        
        toast({
          title: "Video recording started",
          description: "Speak clearly and maintain good posture",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not access camera",
        });
      }
    });
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      if (videoStream.current) {
        videoStream.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedVideo(null);
    setFeedback(null);
  };

  const playRecording = () => {
    const videoElement = document.querySelector('video');
    if (videoElement && recordedVideo) {
      videoElement.src = URL.createObjectURL(recordedVideo);
      videoElement.play();
    }
  };

  return {
    isRecording,
    recordedVideo,
    feedback,
    countdown,
    startRecording,
    stopRecording,
    playRecording,
    resetRecording
  };
};