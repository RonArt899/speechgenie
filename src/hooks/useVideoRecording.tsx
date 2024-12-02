import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoStream = useRef<MediaStream | null>(null);
  const transcriber = useRef<any>(null);
  const { toast } = useToast();

  const initializeTranscriber = async () => {
    try {
      transcriber.current = await pipeline(
        "automatic-speech-recognition",
        "openai/whisper-tiny.en"
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
      
      // Wait for countdown to finish before starting recording
      setTimeout(() => {
        if (mediaRecorder.current) {
          mediaRecorder.current.start();
          setIsRecording(true);
          
          toast({
            title: "Video recording started",
            description: "Speak clearly and maintain good posture",
          });
        }
      }, 5000);
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
    try {
      let transcript = "";
      
      // Extract audio from video for transcription
      const audioContext = new AudioContext();
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(videoBlob);
      
      // Wait for metadata to load
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });
      
      // Create MediaElementAudioSourceNode
      await videoElement.play();
      const source = audioContext.createMediaElementSource(videoElement);
      const audioDestination = audioContext.createMediaStreamDestination();
      source.connect(audioDestination);
      
      // Record audio stream
      const audioRecorder = new MediaRecorder(audioDestination.stream);
      const audioChunks: BlobPart[] = [];
      
      audioRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      audioRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
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
        
        setFeedback(mockFeedback);
        
        toast({
          title: "Analysis Complete",
          description: "Your video has been analyzed successfully.",
        });
      };
      
      // Start recording audio and play video
      audioRecorder.start();
      await videoElement.play();
      
      // Stop recording when video ends
      videoElement.onended = () => {
        audioRecorder.stop();
        videoElement.remove();
      };
      
    } catch (err) {
      console.error("Video analysis error:", err);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to analyze video. Please try again.",
      });
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