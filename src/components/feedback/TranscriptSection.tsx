import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptSectionProps {
  transcript?: string;
}

const TranscriptSection: React.FC<TranscriptSectionProps> = ({ transcript }) => {
  if (!transcript) return null;
  
  return (
    <>
      <Separator />
      <div className="space-y-3">
        <h4 className="font-medium">Transcript</h4>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            "{transcript}"
          </p>
        </ScrollArea>
      </div>
    </>
  );
};

export default TranscriptSection;