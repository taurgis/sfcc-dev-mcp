import React from 'react';
import { H3 } from './Typography';

export const NextStepsStrip: React.FC = () => {
  const cards = [
    { href: '/ai-interfaces', title: '🤖 AI Interface Setup', desc: 'Connect Claude, Copilot, Cursor' },
    { href: '/tools', title: '🛠️ Tool Surface', desc: 'Explore all available tools' },
    { href: '/examples', title: '💡 Examples', desc: 'Real prompts & outcomes' },
    { href: '/troubleshooting', title: '🐛 Troubleshooting', desc: 'Diagnose common issues' }
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
      {cards.map(c => (
        <a key={c.href} href={c.href} className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-400 hover:shadow transition no-underline focus:outline-none focus:ring-2 focus:ring-blue-500">
          <H3 className="text-base font-semibold mb-1 group-hover:text-blue-700">{c.title}</H3>
          <p className="text-xs text-gray-600">{c.desc}</p>
        </a>
      ))}
    </div>
  );
};

export default NextStepsStrip;
