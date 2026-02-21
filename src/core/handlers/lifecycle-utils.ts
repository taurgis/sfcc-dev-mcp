interface LifecycleClient {
  destroy?: () => Promise<void> | void;
  dispose?: () => Promise<void> | void;
  close?: () => Promise<void> | void;
}

/**
 * Execute a best-effort lifecycle teardown for client instances.
 */
export async function teardownLifecycleClient(client: unknown): Promise<void> {
  const lifecycleClient = client as LifecycleClient;

  if (typeof lifecycleClient.destroy === 'function') {
    await lifecycleClient.destroy();
    return;
  }

  if (typeof lifecycleClient.dispose === 'function') {
    await lifecycleClient.dispose();
    return;
  }

  if (typeof lifecycleClient.close === 'function') {
    await lifecycleClient.close();
  }
}
