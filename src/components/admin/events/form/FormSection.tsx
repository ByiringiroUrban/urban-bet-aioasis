
import React from 'react';

interface FormSectionProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const FormSection = ({ title, className, children }: FormSectionProps) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {title && <h4 className="text-sm font-medium">{title}</h4>}
      {children}
    </div>
  );
};

export default FormSection;
