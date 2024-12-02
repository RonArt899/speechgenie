import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpeechFeedbackProps {
  feedback: {
    rate: string;
    volume: string;
    melody: string;
    content: string;
    score: number;
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
      
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Speech Rate</p>
          <p className="text-sm">{feedback.rate}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Volume</p>
          <p className="text-sm">{feedback.volume}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Melody</p>
          <p className="text-sm">{feedback.melody}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Content Analysis</p>
          <p className="text-sm">{feedback.content}</p>
        </div>
      </div>
    </Card>
  );
};

export default SpeechFeedback;