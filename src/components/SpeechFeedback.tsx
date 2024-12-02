import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SpeechFeedbackProps {
  feedback: {
    delivery: {
      rate: string;
      volume: string;
      melody: string;
    };
    content: {
      structure: string;
      opening: string;
      closing: string;
      tone: string;
    };
    score: number;
    transcript?: string;
  } | null;
}

const SpeechFeedback: React.FC<SpeechFeedbackProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <Card className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Speech Analysis</h3>
        <Badge variant="secondary" className="text-sm">
          Score: {feedback.score}/100
        </Badge>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium">Part 1: Speech Delivery</h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Speech Rate</p>
              <p className="text-sm">{feedback.delivery.rate}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Volume</p>
              <p className="text-sm">{feedback.delivery.volume}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Melody</p>
              <p className="text-sm">{feedback.delivery.melody}</p>
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-medium">Part 2: Content Analysis</h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Structure</p>
              <p className="text-sm">{feedback.content.structure}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Opening</p>
              <p className="text-sm">{feedback.content.opening}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Closing</p>
              <p className="text-sm">{feedback.content.closing}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Tone of Voice</p>
              <p className="text-sm">{feedback.content.tone}</p>
            </div>
          </div>
        </div>

        {feedback.transcript && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Transcript</h4>
              <p className="text-sm whitespace-pre-wrap">{feedback.transcript}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default SpeechFeedback;