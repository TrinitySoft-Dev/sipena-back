// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: 'https://886cab776e0730b960d39a05e8c36f6b@o4508665873956864.ingest.us.sentry.io/4508665920094208',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
})

Sentry.profiler.startProfiler()

Sentry.startSpan(
  {
    name: 'My First Transaction',
  },
  () => {},
)

Sentry.profiler.stopProfiler()
