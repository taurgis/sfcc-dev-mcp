import React from 'react';
import CodeBlock from './CodeBlock';

interface FieldState {
  hostname: string;
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  codeVersion: string;
  siteId: string;
  minimal: boolean;
}

const initial: FieldState = {
  hostname: 'dev01-sandbox.us01.dx.commercecloud.salesforce.com',
  username: 'your-username',
  password: 'your-password',
  clientId: '',
  clientSecret: '',
  codeVersion: 'version1',
  siteId: 'RefArch',
  minimal: true
};

const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1';
const inputCls = 'w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm bg-white';

const pillBase = 'px-3 py-1.5 rounded-full text-xs font-medium transition border flex items-center gap-1';

export const ConfigBuilder: React.FC = () => {
  const [state, setState] = React.useState<FieldState>(initial);

  const toggleMinimal = () => setState(s => ({ ...s, minimal: !s.minimal }));

  const json = React.useMemo(() => {
    const base: Record<string, string> = {
      hostname: state.hostname,
      username: state.username,
      password: state.password
    };
    if (!state.minimal) {
      if (state.clientId) base['client-id'] = state.clientId;
      if (state.clientSecret) base['client-secret'] = state.clientSecret;
      if (state.codeVersion) base['code-version'] = state.codeVersion;
      if (state.siteId) base['site-id'] = state.siteId;
    }
    return JSON.stringify(base, null, 2);
  }, [state]);

  const update = (k: keyof FieldState) => (e: React.ChangeEvent<HTMLInputElement>) => setState(s => ({ ...s, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={toggleMinimal} className={`${pillBase} ${state.minimal ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'}`}
          aria-pressed={state.minimal}>
          {state.minimal ? 'Minimal Config' : 'Show Minimal'}
        </button>
        <button onClick={toggleMinimal} className={`${pillBase} ${!state.minimal ? 'bg-purple-600 text-white border-purple-600 shadow' : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400'}`}
          aria-pressed={!state.minimal}>
          {!state.minimal ? 'Advanced Config' : 'Show Advanced'}
        </button>
        <span className="text-xs text-gray-500">Toggle to include OAuth + code/site fields</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Hostname *</label>
            <input value={state.hostname} onChange={update('hostname')} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Username *</label>
              <input value={state.username} onChange={update('username')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Password *</label>
              <input type="password" value={state.password} onChange={update('password')} className={inputCls} />
            </div>
          </div>
          {!state.minimal && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Client ID</label>
                  <input value={state.clientId} onChange={update('clientId')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Client Secret</label>
                  <input type="password" value={state.clientSecret} onChange={update('clientSecret')} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Code Version</label>
                  <input value={state.codeVersion} onChange={update('codeVersion')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Site ID</label>
                  <input value={state.siteId} onChange={update('siteId')} className={inputCls} />
                </div>
              </div>
            </>
          )}
          <p className="text-[11px] text-gray-500">* Required for WebDAV + log tools. Client credentials unlock Data API features.</p>
        </div>
        <div>
          <CodeBlock language="json" code={json} />
          <p className="text-xs text-gray-500 -mt-4">Copy & save as <code className="font-mono">dw.json</code> then run with <code className="font-mono">--dw-json ./dw.json</code></p>
        </div>
      </div>
    </div>
  );
};

export default ConfigBuilder;
