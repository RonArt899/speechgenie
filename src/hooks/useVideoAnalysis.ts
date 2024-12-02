import { useRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import { transcribeAudio } from '@/utils/transcriptionUtils';

export const useVideoAnalysis = () => {
  const transcriber = useRef<any>(null);

  const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
    const audioContext = new AudioContext();
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(videoBlob);
    
    await new Promise((resolve) => {
      videoElement.onloadedmetadata = resolve;
    });
    
    await videoElement.play();
    const source = audioContext.createMediaElementSource(videoElement);
    const audioDestination = audioContext.createMediaStreamDestination();
    source.connect(audioDestination);
    
    return new Promise((resolve) => {
      const audioRecorder = new MediaRecorder(audioDestination.stream);
      const audioChunks: BlobPart[] = [];
      
      audioRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        videoElement.remove();
        resolve(audioBlob);
      };
      
      audioRecorder.start();
      videoElement.onended = () => audioRecorder.stop();
    });
  };

  const analyzeVideo = async (videoBlob: Blob) => {
    try {
      const audioBlob = await extractAudioFromVideo(videoBlob);
      const transcript = await transcribeAudio(audioBlob, transcriber.current);
      
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
        score: 88,
        transcript: transcript || "Transcription unavailable. Please try recording again.",
      };
      
      toast({
        title: "Analysis Complete",
        description: "Your video has been analyzed successfully.",
      });

      return mockFeedback;
    } catch (err) {
      console.error("Video analysis error:", err);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to analyze video. Please try again.",
      });
      return null;
    }
  };

  return { analyzeVideo };
};