import { useRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import { transcribeAudio } from '@/utils/transcriptionUtils';

export const useAudioAnalysis = () => {
  const transcriber = useRef<any>(null);

  const analyzeSpeech = async (audioBlob: Blob) => {
    try {
      // Get the transcript
      const transcript = await transcribeAudio(audioBlob, transcriber.current);
      
      if (!transcript) {
        toast({
          variant: "destructive",
          title: "Analysis Error",
          description: "Could not transcribe the speech. Please try again with clearer audio.",
        });
        return null;
      }

      // Analyze speech characteristics
      const audioContext = new AudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Calculate average volume
      const channelData = audioBuffer.getChannelData(0);
      const volume = Math.sqrt(channelData.reduce((acc, val) => acc + val * val, 0) / channelData.length);
      
      // Calculate speech rate (rough estimation based on transcript length and duration)
      const wordsCount = transcript.split(' ').length;
      const durationInMinutes = audioBuffer.duration / 60;
      const wordsPerMinute = wordsCount / durationInMinutes;
      
      // Analyze volume consistency
      const volumeVariations = [];
      const sampleSize = Math.floor(channelData.length / 100);
      for (let i = 0; i < 100; i++) {
        const start = i * sampleSize;
        const segment = channelData.slice(start, start + sampleSize);
        const segmentVolume = Math.sqrt(segment.reduce((acc, val) => acc + val * val, 0) / segment.length);
        volumeVariations.push(segmentVolume);
      }
      const volumeConsistency = 1 - (Math.max(...volumeVariations) - Math.min(...volumeVariations));

      // Calculate overall score
      let score = 0;
      let volumeFeedback = "";
      let rateFeedback = "";
      let melodyFeedback = "";

      // Volume scoring (0-30 points)
      if (volume > 0.2) {
        score += 30;
        volumeFeedback = "Good volume level, clearly audible.";
      } else if (volume > 0.1) {
        score += 20;
        volumeFeedback = "Volume is a bit low. Try speaking louder for better clarity.";
      } else {
        score += 10;
        volumeFeedback = "Volume is too low. Speak up to ensure your audience can hear you clearly.";
      }

      // Speech rate scoring (0-30 points)
      if (wordsPerMinute >= 120 && wordsPerMinute <= 160) {
        score += 30;
        rateFeedback = "Excellent pace, very natural and easy to follow.";
      } else if (wordsPerMinute > 160) {
        score += 15;
        rateFeedback = "You're speaking too fast. Try slowing down to improve clarity.";
      } else {
        score += 15;
        rateFeedback = "Your pace is a bit slow. Try to speak more fluently while maintaining clarity.";
      }

      // Volume consistency scoring (0-40 points)
      if (volumeConsistency > 0.8) {
        score += 40;
        melodyFeedback = "Great vocal variety and consistent volume.";
      } else if (volumeConsistency > 0.6) {
        score += 25;
        melodyFeedback = "Try to maintain more consistent volume throughout your speech.";
      } else {
        score += 15;
        melodyFeedback = "Volume varies too much. Focus on maintaining steady volume while speaking.";
      }

      // Analyze content structure
      const sentences = transcript.split(/[.!?]+/).filter(Boolean);
      const hasIntro = sentences[0]?.length > 20;
      const hasConclusion = sentences[sentences.length - 1]?.length > 20;
      
      const feedback = {
        delivery: {
          rate: rateFeedback,
          volume: volumeFeedback,
          melody: melodyFeedback,
        },
        content: {
          structure: sentences.length < 3 
            ? "Your speech is too short. Try to develop your ideas more."
            : "Good structure with multiple points.",
          opening: hasIntro 
            ? "Strong opening that sets the context."
            : "Consider adding a stronger introduction to engage your audience.",
          closing: hasConclusion 
            ? "Good conclusion that wraps up your points."
            : "Try to end with a stronger conclusion to reinforce your message.",
          tone: volume > 0.15 
            ? "Confident and engaging tone."
            : "Work on projecting more confidence in your voice.",
        },
        score,
        transcript,
      };
      
      toast({
        title: score > 70 ? "Great job!" : "Room for improvement",
        description: score > 70 
          ? "Your speech was well delivered. Keep up the good work!" 
          : "Check the feedback below to improve your speaking skills.",
      });

      return feedback;
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