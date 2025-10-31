import { adminModel } from '~/models/admin.model'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/configs/environment'
import { v7 as uuidv7 } from 'uuid'
import bcrypt from 'bcryptjs'
import { pickAdmin } from '~/utils/fomatter'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { JwtProvider } from '~/providers/JwtProvider'

const createNew = async (req: any) => {
  try {
    const { secretKey, email, password } = req.body

    const existsAdmin = await adminModel.findOneByEmail(email)

    if (existsAdmin) {
      throw new ApiError(StatusCodes.CONFLICT, 'Admin already exists')
    }

    if (secretKey !== env.ADMIN_CREATION_SECRET_KEY) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Invalid secret key for admin creation'
      )
    }

    const nameFromEmail: string = (email as string).split('@')[0]

    const adminData = {
      email,
      password: await bcrypt.hash(password as string, 8),
      displayName: nameFromEmail,
      isActive: false,
      verifyToken: uuidv7()
    }

    const createdAdmin = await adminModel.createNew(adminData)

    const getNewAdmin = await adminModel.findOneById(
      createdAdmin.insertedId.toString()
    )

    if (!getNewAdmin) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to retrieve newly created admin.'
      )
    }

    // Send a welcome email to the new admin
    const verificationLink = `${WEBSITE_DOMAIN}/admin/account/verification?email=${getNewAdmin.email}&token=${getNewAdmin.verifyToken}`
    const customSubject =
      'Welcome to FitTrack Admin — Please Verify Your Email Address'

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; background: #f4f7fa; padding: 32px 0;">
    <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding: 36px;">
      <h2 style="color: #2d8cf0; text-align: center; margin-bottom: 24px;">Welcome to FitTrack Admin</h2>
      <p style="font-size: 16px; color: #333;">Dear Administrator,</p>
      <p style="font-size: 15px; color: #444; line-height: 1.6;">
        We are delighted to welcome you to the <b>FitTrack Admin Panel</b>! Before you begin managing users and monitoring fitness data, please verify your email address to activate your admin account.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href=${verificationLink} style="display: inline-block; background: #2d8cf0; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Verify Email
        </a>
      </div>
      <p style="font-size: 13px; color: #888; line-height: 1.5;">
        If the button above doesn’t work, please copy and paste the link below into your browser:
      </p>
      <div style="word-break: break-all; background: #f4f4f4; padding: 10px 14px; border-radius: 4px; font-size: 13px; color: #2d8cf0; margin-bottom: 24px;">
        ${verificationLink}
      </div>
      <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 13px; color: #888; line-height: 1.5;">
        Thank you for joining FitTrack. We look forward to your contribution in building a stronger and healthier community.
      </p>
      <div style="font-size: 13px; color: #888; margin-top: 16px;">
        Best regards,<br/>
        <b>The FitTrack Team</b><br/>
      </div>
    </div>
  </div>
    `

    await BrevoProvider.sendEmail(getNewAdmin.email, customSubject, htmlContent)

    return pickAdmin(getNewAdmin)
  } catch (error) {
    throw error
  }
}

const verifyEmail = async (req: any) => {
  try {
    const { email, token } = req.body

    const admin = await adminModel.findOneByEmail(email)

    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found')
    }
    if (admin.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Admin already verified')
    }
    if (admin.verifyToken !== token) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid verification token')
    }

    const updateAdmin = {
      isActive: true,
      verifyToken: ''
    }
    if (!admin._id) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Admin ID is missing'
      )
    }

    // Update admin status to active
    await adminModel.update(admin._id.toString(), updateAdmin)

    return pickAdmin(admin)
  } catch (error) {
    throw error
  }
}

const login = async (req: any) => {
  try {
    const { email, password } = req.body

    const admin = await adminModel.findOneByEmail(email)

    if (!admin) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found')
    }
    if (!admin.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your admin account is not active! Please verify your email!'
      )
    }

    if (!bcrypt.compareSync(password, admin.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your Email of Password is incorrect!'
      )
    }

    const adminInfo = {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }

    const accessToken = await JwtProvider.generateToken(
      adminInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      env.ACCESS_TOKEN_LIFE as string
    )

    const refreshToken = await JwtProvider.generateToken(
      adminInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
      env.REFRESH_TOKEN_LIFE as string
    )

    return {
      accessToken,
      refreshToken,
      ...pickAdmin(admin)
    }
  } catch (error) {
    throw error
  }
}

export const adminService = {
  createNew,
  verifyEmail,
  login
}
