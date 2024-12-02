import React from 'react';

interface FeedbackSectionProps {
  title: string;
  children: React.ReactNode;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

export default FeedbackSection;