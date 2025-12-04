export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  message: string
  accessToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  data: any
}

export interface VerifyEmailResponse {
  message: string
  data: any
}

export interface VerifyEmailRequest {
  email: string
  token: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
} 

export interface ChangePasswordResponse {
  message: string
  data: any 
} 