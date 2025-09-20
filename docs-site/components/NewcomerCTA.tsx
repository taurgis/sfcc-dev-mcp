import React from 'react';

interface NewcomerCTAProps {
  /** Additional CSS classes to apply to the wrapper */
  className?: string;
  /** Custom href if different from default */
  href?: string;
  /** Whether to show as centered or inline */
  centered?: boolean;
}

/**
 * Prominent call-to-action button for users new to MCP servers.
 * Directs them to the AI assistant setup guide.
 */
const NewcomerCTA: React.FC<NewcomerCTAProps> = ({ 
  className = '', 
  href = '/ai-interfaces/#ai-assistant-setup',
  centered = true 
}) => {
  const wrapperClasses = centered ? 'text-center' : '';
  
  return (
    <div className={`${wrapperClasses} ${className}`}>
      <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 p-1 rounded-2xl shadow-lg">
        <a 
          href={href}
          className="group block bg-white rounded-xl px-8 py-4 text-center no-underline hover:no-underline focus:no-underline transition-all duration-300 hover:bg-gray-50"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-gray-900 mb-1">
                New to MCP servers? 
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform text-orange-600">→</span>
              </div>
              <div className="text-sm text-gray-600">
                Complete setup guide for AI assistants (Claude, GitHub Copilot, etc.)
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default NewcomerCTA;