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
