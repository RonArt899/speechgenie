import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Float32Array | null>(null);
  const animationFrame = useRef<number>();
  const transcriber = useRef<any>(null);
  const { toast } = useToast();

  const initializeTranscriber = async () => {
    try {
      transcriber.current = await pipeline(
        "automatic-speech-recognition",
        "openai/whisper-tiny.en",
        { quantized: true }
      );
    } catch (err) {
      console.error("Failed to initialize transcriber:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not initialize speech recognition",
      });
    }
  };

  const updateAudioData = () => {
    if (analyser.current && dataArray.current) {
      analyser.current.getFloatTimeDomainData(dataArray.current);
      setAudioData(new Float32Array(dataArray.current));
      animationFrame.current = requestAnimationFrame(updateAudioData);
    }
  };

  const initializeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 2048;
      source.connect(analyser.current);
      
      dataArray.current = new Float32Array(analyser.current.frequencyBinCount);
      
      const chunks: BlobPart[] = [];
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudio(blob);
        analyzeSpeech(blob);
      };
      
      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone",
      });
      return false;
    }
  };

  const startRecording = async () => {
    setCountdown(5);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const success = await initializeRecording();
    if (!success) return;

    // Wait for countdown to finish before starting recording
    setTimeout(() => {
      if (mediaRecorder.current) {
        mediaRecorder.current.start();
        setIsRecording(true);
        updateAudioData();
        
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone",
        });
      }
    }, 5000);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      cancelAnimationFrame(animationFrame.current!);
    }
  };

  const analyzeSpeech = async (audioBlob: Blob) => {
    try {
      let transcript = "";
      
      if (transcriber.current) {
        const result = await transcriber.current(audioBlob);
        transcript = result.text;
      } else {
        await initializeTranscriber();
        if (transcriber.current) {
          const result = await transcriber.current(audioBlob);
          transcript = result.text;
        }
      }

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
      
      setFeedback(mockFeedback);
      
      toast({
        title: "Analysis Complete",
        description: "Your speech has been analyzed successfully.",
      });
    } catch (err) {
      console.error("Speech analysis error:", err);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to analyze speech. Please try again.",
      });
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setFeedback(null);
    setAudioData(null);
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(URL.createObjectURL(recordedAudio));
      audio.play();
    }
  };

  return {
    isRecording,
    audioData,
    recordedAudio,
    feedback,
    countdown,
    startRecording,
    stopRecording,
    playRecording,
    resetRecording
  };
};
