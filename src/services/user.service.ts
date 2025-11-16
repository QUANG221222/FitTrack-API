import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { v7 as uuidv7 } from 'uuid'
import bcrypt from 'bcryptjs'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { pickUser } from '~/utils/fomatter'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (req: Request): Promise<any> => {
  try {
    const { email, password } = req.body

    const exitUser = await userModel.findOneByEmail(email)

    if (exitUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
    }

    const nameFromEmail: string = (email as string).split('@')[0]

    // Prepare user data
    const userData = {
      email,
      password: await bcrypt.hash(password as string, 8),
      displayName: nameFromEmail,
      isActive: false,
      verifyToken: uuidv7()
    }

    const createdUser = await userModel.createNew(userData)

    const getNewUser = await userModel.findOneById(
      createdUser.insertedId.toString()
    )

    if (!getNewUser) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to retrieve newly created user.'
      )
    }

    // Send a welcome email to the new user
    const verificationLink = `${WEBSITE_DOMAIN}/user/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject =
      'FitTrack: Please verify your email before using our services!'
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
      <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
        <h2 style="color: #2d8cf0; margin-bottom: 16px;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #333;">Thank you for registering with <b>FitTrack</b>!</p>
        <p style="font-size: 15px; color: #444;">Please click the button below to verify your email address:</p>
        <a href="${verificationLink}" style="display: flex;
        justify-content: center; align-items: center; margin: 24px 0; padding: 12px 28px; background: #2d8cf0; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Verify Email</a>
        <p style="font-size: 13px; color: #888;">If the button doesn't work, copy and paste this link into your browser:</p>
        <div style="word-break: break-all; background: #f4f4f4; padding: 8px 12px; border-radius: 4px; font-size: 13px; color: #2d8cf0;">${verificationLink}</div>
        <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;">
        <div style="font-size: 13px; color: #888;">
        Sincerely,<br/>
        <b>FitTrack Team</b>
        </div>
      </div>
      </div>
    `

    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const getProfile = async (req: Request): Promise<any> => {
  try {
    const userId = req.jwtDecoded.id

    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    return pickUser(user)
  } catch (error) {
    throw error
  }
}

const update = async (req: Request): Promise<any> => {
  try {
    // Get user ID from JWT token
    const userId = req.jwtDecoded.id

    // Find user
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Handle avatar upload if file is provided
    if (req.file) {
      // Delete old avatar from Cloudinary if exists
      if (user.avatarPublicId) {
        await CloudinaryProvider.deleteImage(user.avatarPublicId)
      }

      // ✅ Save both avatar URL and public_id from Cloudinary
      req.body.avatar = req.file.path
      req.body.avatarPublicId = (req.file as any).filename // Cloudinary public_id
    }

    // Prepare update data
    const updateData = { updatedAt: Date.now(), ...req.body }

    // Update user in database
    const updatedUser = await userModel.update(userId, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  getProfile,
  update
}
