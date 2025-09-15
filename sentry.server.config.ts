// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://31fcbe176745c73546b885ba8dd24e21@o4508686736556032.ingest.de.sentry.io/4510000998973520',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  telemetry: false,

  // Enable logs to be sent to Sentry
  enableLogs: process.env.NODE_ENV !== 'production',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
