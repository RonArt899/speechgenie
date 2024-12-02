import { useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useRecordingState } from './useRecordingState';
import { useAudioAnalysis } from './useAudioAnalysis';

export const useAudioRecording = () => {
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Float32Array | null>(null);
  const animationFrame = useRef<number>();
  const { toast } = useToast();

  const { 
    isRecording, 
    setIsRecording, 
    countdown, 
    feedback, 
    setFeedback, 
    startCountdown 
  } = useRecordingState();

  const { analyzeSpeech } = useAudioAnalysis();

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
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudio(blob);
        const result = await analyzeSpeech(blob);
        if (result) setFeedback(result);
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
    startCountdown(async () => {
      const success = await initializeRecording();
      if (!success) return;

      if (mediaRecorder.current) {
        mediaRecorder.current.start();
        setIsRecording(true);
        updateAudioData();
        
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone",
        });
      }
    });
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      cancelAnimationFrame(animationFrame.current!);
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