import React from 'react';

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  intent?: 'info' | 'warn' | 'danger' | 'plain';
  id?: string;
}

const intentStyles: Record<string,string> = {
  info: 'border-blue-200 bg-blue-50',
  warn: 'border-yellow-200 bg-yellow-50',
  danger: 'border-red-200 bg-red-50',
  plain: 'border-gray-200 bg-white'
};

export const Collapsible: React.FC<CollapsibleProps> = ({ title, defaultOpen=false, children, intent='plain', id }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div id={id} className={`rounded-xl border ${intentStyles[intent]} overflow-hidden`}> 
      <button
        onClick={() => setOpen(o=>!o)}
        className="w-full flex items-center justify-between px-5 py-3 text-left text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="ml-4 text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-sm text-gray-700 space-y-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
