import { pipeline } from "@huggingface/transformers";
import { toast } from "@/components/ui/use-toast";

export const initializeTranscriber = async () => {
  try {
    return await pipeline(
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
    return null;
  }
};

export const transcribeAudio = async (audioBlob: Blob, transcriber: any) => {
  try {
    if (!transcriber) {
      transcriber = await initializeTranscriber();
    }
    
    if (transcriber) {
      const result = await transcriber(audioBlob);
      return result.text;
    }
    return "";
  } catch (err) {
    console.error("Transcription error:", err);
    return "";
  }
};