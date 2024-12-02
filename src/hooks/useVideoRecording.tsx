import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      videoStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(blob);
        analyzeVideo(blob);
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

  const analyzeVideo = async (videoBlob: Blob) => {
    // Mock feedback for demonstration
    const mockFeedback = {
      presence: {
        bodyLanguage: "Your body language appears confident and engaged. Try to maintain a more open stance.",
        handGestures: "Good use of natural hand gestures. Consider using more purposeful gestures to emphasize key points.",
        posture: "Excellent upright posture throughout most of the presentation. Minor slouching noticed occasionally.",
        eyeContact: "Strong eye contact maintained. Remember to scan the entire audience periodically.",
        overallPresence: "Commanding presence with room for more dynamic expression in key moments.",
      },
      delivery: {
        rate: "Well-paced speech with good rhythm. Could vary pace more for emphasis.",
        volume: "Clear and audible throughout. Consider more dynamic range.",
        melody: "Natural speaking pattern with good variation in tone.",
      },
      content: {
        structure: "Well-organized presentation with clear transitions.",
        opening: "Engaging introduction that sets context effectively.",
        closing: "Strong conclusion that reinforces main message.",
        tone: "Professional and authentic tone that connects with audience.",
      },
      score: 88
    };
    
    setFeedback(mockFeedback);
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
    startRecording,
    stopRecording,
    playRecording,
    resetRecording
  };
};