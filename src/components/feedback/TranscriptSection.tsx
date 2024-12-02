import React from 'react';
import { Separator } from '@/components/ui/separator';

interface TranscriptSectionProps {
  transcript: string;
}

const TranscriptSection: React.FC<TranscriptSectionProps> = ({ transcript }) => {
  if (!transcript) return null;
  
  return (
    <>
      <Separator />
      <div className="space-y-3">
        <h4 className="font-medium">Transcript</h4>
        <p className="text-sm whitespace-pre-wrap">{transcript}</p>
      </div>
    </>
  );
};

export default TranscriptSection;