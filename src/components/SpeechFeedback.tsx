import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FeedbackHeader from './feedback/FeedbackHeader';
import FeedbackSection from './feedback/FeedbackSection';
import FeedbackItem from './feedback/FeedbackItem';

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
  } | null;
}

const SpeechFeedback: React.FC<SpeechFeedbackProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <Card className="p-6 space-y-4 animate-fade-in">
      <FeedbackHeader title="Speech Analysis" score={feedback.score} />
      
      <div className="space-y-6">
        <FeedbackSection title="Part 1: Speech Delivery">
          <FeedbackItem label="Speech Rate" value={feedback.delivery.rate} />
          <FeedbackItem label="Volume" value={feedback.delivery.volume} />
          <FeedbackItem label="Melody" value={feedback.delivery.melody} />
        </FeedbackSection>

        <Separator />
        
        <FeedbackSection title="Part 2: Content Analysis">
          <FeedbackItem label="Structure" value={feedback.content.structure} />
          <FeedbackItem label="Opening" value={feedback.content.opening} />
          <FeedbackItem label="Closing" value={feedback.content.closing} />
          <FeedbackItem label="Tone of Voice" value={feedback.content.tone} />
        </FeedbackSection>
      </div>
    </Card>
  );
};

export default SpeechFeedback;