// Gunakan dynamic import untuk menghindari eager loading saat HMR pada edge runtime.
// Hal ini mencegah error "module factory is not available" yang muncul dengan Turbopack.
import type * as SentryType from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DISABLED) return;

  const Sentry = await import('@sentry/nextjs');

  const sentryOptions: SentryType.NodeOptions | SentryType.EdgeOptions = {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    spotlight: process.env.NODE_ENV === 'development',
    sendDefaultPii: true,
    tracesSampleRate: 1,
    debug: false
  };

  // Initialize for both runtimes, respecting NEXT_RUNTIME.
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init(sentryOptions as any);
  }
}

// Ekspor handler yang di-resolve saat runtime untuk menghindari instansiasi modul pada eval time.
export async function onRequestError(
  error: unknown,
  request?: any,
  response?: any
): Promise<any> {
  const { captureRequestError } = await import('@sentry/nextjs');
  return captureRequestError(error as any, request as any, response as any);
}
