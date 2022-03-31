import React, { ReactNode, useEffect, useState } from 'react';

interface OnboardingStepProps {
  isCompleted: boolean;
  stepTitle: string;
  stepContent: ReactNode;
  isExpanded?: boolean;
  isLocked?: boolean;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  stepTitle,
  stepContent,
  isCompleted,
  isExpanded,
  isLocked = false,
}) => {
  const [expanded, setExpanded] = useState(
    (isExpanded && !isCompleted && !isLocked) ?? false,
  );

  const onTitleClick = () => {
    if (isCompleted) {
      return;
    }

    setExpanded(!expanded);
  };

  useEffect(() => {
    if (expanded && isCompleted) {
      setExpanded(false);
    }
  }, [isCompleted]);

  return (
    <>
      <div className="onboarding-step__title" onClick={onTitleClick}>
        <b>{stepTitle}</b> {isCompleted && <>&#10003;</>}
        {!isCompleted && expanded && !isLocked && <>(click to close)</>}
        {!isCompleted && !expanded && !isLocked && <>(click to open)</>}
        {!isCompleted && isLocked && <>(Comming soon)</>}
      </div>
      {expanded && (
        <div className="onboarding-step__content">{stepContent}</div>
      )}
    </>
  );
};
