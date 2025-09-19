import React from 'react';
// Dynamically require root package.json (relative two levels up from docs-site-v2 when built inside project root)
// During build (Vite), this will be statically analyzed; if path changes, adjust.
// Using assert { type: 'json' } not needed with Vite's JSON import capability.
// We keep it isolated so only Sidebar re-renders on version change.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import pkg from '../../package.json';

const VersionBadge: React.FC = () => {
  const version = (pkg as any)?.version || 'v1';
  return (
    <span className="text-sm text-slate-500 self-start mt-1" title="Library Version">
      v{version}
    </span>
  );
};

export default VersionBadge;