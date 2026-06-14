// job constants
export const PUBLISH_EVENTS_JOB = 'cron-publish-events';
export const STUCK_EVENTS_RECOVERY_JOB = 'cron-stuck-events-recovery';

// queue constants
export const OUTBOX_QUEUE = 'outbox-queue';

// cron patterns
export const CronPattern = {
    EVERY_20_SECONDS: '*/20 * * * * *',
    EVERY_5_MINUTES: '*/5 * * * *',
    EVERY_HOUR: '0 * * * *',
    DAILY_MIDNIGHT: '0 0 * * *',
} as const;

export type CronPattern = typeof CronPattern[keyof typeof CronPattern];
