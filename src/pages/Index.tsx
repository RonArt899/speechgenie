import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Play, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AudioVisualizer from '@/components/AudioVisualizer';
import SpeechFeedback from '@/components/SpeechFeedback';
import { pipeline } from "@huggingface/transformers";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Float32Array | null>(null);
  const animationFrame = useRef<number>();
  const { toast } = useToast();

  const startRecording = async () => {
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
      
      mediaRecorder.current.start();
      setIsRecording(true);
      updateAudioData();
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      cancelAnimationFrame(animationFrame.current!);
    }
  };

  const updateAudioData = () => {
    if (analyser.current && dataArray.current) {
      analyser.current.getFloatTimeDomainData(dataArray.current);
      setAudioData(new Float32Array(dataArray.current));
      animationFrame.current = requestAnimationFrame(updateAudioData);
    }
  };

  const analyzeSpeech = async (audioBlob: Blob) => {
    try {
      // In a real application, you would send the audio to a server for processing
      // This is a mock response for demonstration
      const mockFeedback = {
        rate: "Your speech rate is moderate and easy to follow. Consider varying the pace for emphasis.",
        volume: "Good volume level with consistent projection. Some variations could add more dynamism.",
        melody: "Natural intonation patterns. Could benefit from more pitch variation in key points.",
        content: "Well-structured content with clear main points. Consider adding more specific examples.",
        score: 85
      };
      
      setFeedback(mockFeedback);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Could not analyze the speech",
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

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="w-full h-[300px] relative overflow-hidden rounded-lg mb-8">
          <img 
            src="/lovable-uploads/4d352a17-c70d-4474-bd1e-282705449c59.png" 
            alt="Public speaker addressing an audience" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h1 className="text-4xl font-bold tracking-tight mb-2">Speech Practice</h1>
              <p className="text-xl text-white/90">
                Record your speech and get AI-powered feedback
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <AudioVisualizer audioData={audioData} />
          
          <div className="flex justify-center gap-4">
            {!isRecording && !recordedAudio && (
              <Button
                size="lg"
                onClick={startRecording}
                className="animate-scale-up"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
                className="animate-pulse"
              >
                <Square className="mr-2 h-5 w-5" />
                Stop Recording
              </Button>
            )}
            
            {recordedAudio && !isRecording && (
              <>
                <Button size="lg" onClick={playRecording}>
                  <Play className="mr-2 h-5 w-5" />
                  Play Recording
                </Button>
                <Button size="lg" variant="outline" onClick={resetRecording}>
                  <RotateCcw className="mr-2 h-5 w-5" />
                  New Recording
                </Button>
              </>
            )}
          </div>
        </Card>

        {feedback && <SpeechFeedback feedback={feedback} />}
      </div>
    </div>
  );
};

export default Index;