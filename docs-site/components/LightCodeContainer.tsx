import React from 'react';

interface LightCodeContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Visual accent variant. Currently only 'blue' is used but additional
   * variants are easy to extend without editing all call sites again.
   */
  variant?: 'blue' | 'green' | 'purple' | 'indigo' | 'amber' | 'gray';
  /**
   * If true, removes the default shadow for flatter contexts.
   */
  flat?: boolean;
}

const VARIANT_STYLES: Record<string, { bg: string; border: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100' },
  green: { bg: 'bg-green-50', border: 'border-green-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200' }
};

/**
 * Standardized light accent container for wrapping code blocks (or related content)
 * ensuring consistent styling across pages instead of ad-hoc duplicated class names.
 */
const LightCodeContainer: React.FC<LightCodeContainerProps> = ({
  children,
  className = '',
  variant = 'blue',
  flat = false
}) => {
  const { bg, border } = VARIANT_STYLES[variant] || VARIANT_STYLES.blue;
  return (
    <div className={`${bg} ${border} rounded-xl p-6 ${flat ? '' : 'shadow-md'} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default LightCodeContainer;
