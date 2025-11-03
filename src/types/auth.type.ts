export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  message: string
  accessToken: string
}
