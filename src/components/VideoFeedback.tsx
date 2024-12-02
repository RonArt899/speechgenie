import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoFeedbackProps {
  feedback: {
    bodyLanguage: string;
    handGestures: string;
    posture: string;
    eyeContact: string;
    overallPresence: string;
    score: number;
  } | null;
}

const VideoFeedback: React.FC<VideoFeedbackProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <Card className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Video Analysis</h3>
        <Badge variant="secondary" className="text-sm">
          Score: {feedback.score}/100
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Body Language</p>
          <p className="text-sm">{feedback.bodyLanguage}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Hand Gestures</p>
          <p className="text-sm">{feedback.handGestures}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Posture</p>
          <p className="text-sm">{feedback.posture}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Eye Contact</p>
          <p className="text-sm">{feedback.eyeContact}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Overall Presence</p>
          <p className="text-sm">{feedback.overallPresence}</p>
        </div>
      </div>
    </Card>
  );
};

export default VideoFeedback;