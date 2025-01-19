import * as Sentry from '@sentry/nestjs'

Sentry.init({
  dsn: 'https://cbb5fd82c69636e1cb910ba9d9955148@o4508667847835648.ingest.us.sentry.io/4508667848818688',
  integrations: [],
  tracesSampleRate: 1.0,
})

Sentry.profiler.startProfiler()

Sentry.startSpan(
  {
    name: 'My First Transaction',
  },
  () => {},
)

Sentry.profiler.stopProfiler()
