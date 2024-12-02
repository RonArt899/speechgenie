import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import RecordingSection from '@/components/RecordingSection';
import VideoRecordingSection from '@/components/VideoRecordingSection';
import SpeechFeedback from '@/components/SpeechFeedback';
import VideoFeedback from '@/components/VideoFeedback';

const Index = () => {
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState(null);
  
  // Video recording states
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoFeedback, setVideoFeedback] = useState(null);
  
  // Refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoMediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Float32Array | null>(null);
  const animationFrame = useRef<number>();
  const videoStream = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Audio recording functions
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

  // Video recording functions
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      videoStream.current = stream;
      videoMediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      videoMediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      videoMediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(blob);
        analyzeVideo(blob);
      };
      
      // Display preview
      const videoPreview = document.querySelector('video');
      if (videoPreview) {
        videoPreview.srcObject = stream;
      }
      
      videoMediaRecorder.current.start();
      setIsRecordingVideo(true);
      
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

  const stopVideoRecording = () => {
    if (videoMediaRecorder.current && isRecordingVideo) {
      videoMediaRecorder.current.stop();
      if (videoStream.current) {
        videoStream.current.getTracks().forEach(track => track.stop());
      }
      setIsRecordingVideo(false);
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
    // Mock feedback for demonstration
    const mockFeedback = {
      rate: "Your speech rate is moderate and easy to follow. Consider varying the pace for emphasis.",
      volume: "Good volume level with consistent projection. Some variations could add more dynamism.",
      melody: "Natural intonation patterns. Could benefit from more pitch variation in key points.",
      content: "Well-structured content with clear main points. Consider adding more specific examples.",
      score: 85
    };
    
    setFeedback(mockFeedback);
  };

  const analyzeVideo = async (videoBlob: Blob) => {
    // Mock feedback for demonstration
    const mockFeedback = {
      bodyLanguage: "Your body language appears confident and engaged. Try to maintain a more open stance.",
      handGestures: "Good use of natural hand gestures. Consider using more purposeful gestures to emphasize key points.",
      posture: "Excellent upright posture throughout most of the presentation. Minor slouching noticed occasionally.",
      eyeContact: "Strong eye contact maintained. Remember to scan the entire audience periodically.",
      overallPresence: "Commanding presence with room for more dynamic expression in key moments.",
      score: 88
    };
    
    setVideoFeedback(mockFeedback);
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setFeedback(null);
    setAudioData(null);
  };

  const resetVideoRecording = () => {
    setRecordedVideo(null);
    setVideoFeedback(null);
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(URL.createObjectURL(recordedAudio));
      audio.play();
    }
  };

  const playVideoRecording = () => {
    const videoElement = document.querySelector('video');
    if (videoElement && recordedVideo) {
      videoElement.src = URL.createObjectURL(recordedVideo);
      videoElement.play();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Header />
        
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Audio Recording</h2>
          <RecordingSection
            audioData={audioData}
            isRecording={isRecording}
            recordedAudio={recordedAudio}
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
            onStartRecording={startVideoRecording}
            onStopRecording={stopVideoRecording}
            onPlayRecording={playVideoRecording}
            onResetRecording={resetVideoRecording}
          />
          {videoFeedback && <VideoFeedback feedback={videoFeedback} />}
        </div>
      </div>
    </div>
  );
};

export default Index;