import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'https://3dadefcd1f5a8c94b81b85b25975093e@o4509753682427904.ingest.de.sentry.io/4509753878904912',
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
