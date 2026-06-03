// Custom server entry: captures Cloudflare `env` so SSR loaders can reach the
// quiz-be Worker via a Service Binding (env.QUIZ_BE). Same-account workers.dev
// → workers.dev subrequests are blocked by Cloudflare (error 1042), so SSR must
// use the internal binding instead of the public URL.
import { AsyncLocalStorage } from 'node:async_hooks';
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';

const cfEnvStorage = new AsyncLocalStorage<Record<string, unknown>>();
(globalThis as Record<string, unknown>).__cfEnvStorage = cfEnvStorage;

const startFetch = createStartHandler(defaultStreamHandler);

export function createServerEntry(entry: { fetch: (...args: unknown[]) => unknown }) {
  return {
    async fetch(request: Request, env: Record<string, unknown>, ctx: unknown) {
      return cfEnvStorage.run(env ?? {}, () => entry.fetch(request, env, ctx));
    },
  };
}

export default createServerEntry({ fetch: startFetch as (...args: unknown[]) => unknown });
