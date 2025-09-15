import React from 'react';

interface HeadingProps {
  id: string;
  children: React.ReactNode;
}

export const H1: React.FC<HeadingProps> = ({ id, children }) => (
  <h1 id={id} className="text-4xl font-extrabold tracking-tight text-slate-900">
    {children}
  </h1>
);

export const PageSubtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-4 text-xl text-slate-600 !mb-10">
    {children}
  </p>
);

export const H2: React.FC<HeadingProps> = ({ id, children }) => (
  <h2 id={id} className="mt-12 mb-4 text-3xl font-bold tracking-tight text-slate-900">
    {children}
  </h2>
);

export const H3: React.FC<HeadingProps> = ({ id, children }) => (
  <h3 id={id} className="mt-8 mb-3 text-xl font-bold tracking-tight text-slate-900">
    {children}
  </h3>
);
