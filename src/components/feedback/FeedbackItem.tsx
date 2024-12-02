import React from 'react';

interface FeedbackItemProps {
  label: string;
  value: string;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};

export default FeedbackItem;