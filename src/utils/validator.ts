export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE =
  'Your string fails to match the Object Id pattern!'

export const USERNAME_RULE = /^[a-zA-Z0-9_]{3,30}$/
export const USERNAME_RULE_MESSAGE =
  'Username must be 3-30 characters long and can only contain letters, numbers, and underscores.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE =
  'Password must be 8-256 characters, include at least one uppercase letter, one number, and one special character.'
export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
}
export const SECRET_KEY_RULE = /^[A-Za-z0-9+/]{43}=$/
export const SECRET_KEY_MESSAGE =
  'Secret key must be a valid 32-byte base64 encoded string (44 characters).'
