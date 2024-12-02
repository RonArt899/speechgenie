import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FeedbackHeaderProps {
  title: string;
  score: number;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ title, score }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Badge variant="secondary" className="text-sm">
        Score: {score}/100
      </Badge>
    </div>
  );
};

export default FeedbackHeader;