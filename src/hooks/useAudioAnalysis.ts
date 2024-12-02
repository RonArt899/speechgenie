import { useRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import { transcribeAudio } from '@/utils/transcriptionUtils';

export const useAudioAnalysis = () => {
  const transcriber = useRef<any>(null);

  const analyzeSpeech = async (audioBlob: Blob) => {
    try {
      const transcript = await transcribeAudio(audioBlob, transcriber.current);
      
      const mockFeedback = {
        delivery: {
          rate: "Your speech rate is moderate and easy to follow. Consider varying the pace for emphasis.",
          volume: "Good volume level with consistent projection. Some variations could add more dynamism.",
          melody: "Natural intonation patterns. Could benefit from more pitch variation in key points.",
        },
        content: {
          structure: "Clear organization with logical flow between main points.",
          opening: "Strong opening that captures attention effectively.",
          closing: "Conclusion summarizes key points well.",
          tone: "Professional and engaging tone throughout the presentation.",
        },
        score: 85,
        transcript: transcript || "Transcription unavailable. Please try recording again.",
      };
      
      toast({
        title: "Analysis Complete",
        description: "Your speech has been analyzed successfully.",
      });

      return mockFeedback;
    } catch (err) {
      console.error("Speech analysis error:", err);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to analyze speech. Please try again.",
      });
      return null;
    }
  };

  return { analyzeSpeech };
};