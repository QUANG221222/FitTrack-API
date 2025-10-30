/**
 * ApiError class for handling API errors
 * This class extends the built-in Error class to provide a structured way to handle errors in the API.
 */

class ApiError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
