import { env } from '~/configs/environment'

export const WHITELIST_DOMAINS = [
  'https://gym-workout-progress-tracker.vercel.app',
  'https://www.fittrackwk.online'
]

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT
