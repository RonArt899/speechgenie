import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FeedbackHeader from './feedback/FeedbackHeader';
import FeedbackSection from './feedback/FeedbackSection';
import FeedbackItem from './feedback/FeedbackItem';
import TranscriptSection from './feedback/TranscriptSection';

interface VideoFeedbackProps {
  feedback: {
    presence: {
      bodyLanguage: string;
      handGestures: string;
      posture: string;
      eyeContact: string;
      overallPresence: string;
    };
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

const VideoFeedback: React.FC<VideoFeedbackProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <Card className="p-6 space-y-4 animate-fade-in">
      <FeedbackHeader title="Video Analysis" score={feedback.score} />
      
      <div className="space-y-6">
        <FeedbackSection title="Part 1: Physical Presence">
          <FeedbackItem label="Body Language" value={feedback.presence.bodyLanguage} />
          <FeedbackItem label="Hand Gestures" value={feedback.presence.handGestures} />
          <FeedbackItem label="Posture" value={feedback.presence.posture} />
          <FeedbackItem label="Eye Contact" value={feedback.presence.eyeContact} />
          <FeedbackItem label="Overall Presence" value={feedback.presence.overallPresence} />
        </FeedbackSection>

        <Separator />
        
        <FeedbackSection title="Part 2: Speech Delivery">
          <FeedbackItem label="Speech Rate" value={feedback.delivery.rate} />
          <FeedbackItem label="Volume" value={feedback.delivery.volume} />
          <FeedbackItem label="Melody" value={feedback.delivery.melody} />
        </FeedbackSection>

        <Separator />
        
        <FeedbackSection title="Part 3: Content Analysis">
          <FeedbackItem label="Structure" value={feedback.content.structure} />
          <FeedbackItem label="Opening" value={feedback.content.opening} />
          <FeedbackItem label="Closing" value={feedback.content.closing} />
          <FeedbackItem label="Tone of Voice" value={feedback.content.tone} />
        </FeedbackSection>

        <TranscriptSection transcript={feedback.transcript} />
      </div>
    </Card>
  );
};

export default VideoFeedback;