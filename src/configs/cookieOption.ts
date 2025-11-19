import ms from 'ms'
const isProduction = process.env.BUILD_MODE === 'production'

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
  path: '/',
  domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
  maxAge: ms('14 days')
}
export { cookieOptions }
