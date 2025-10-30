import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail
} from '@getbrevo/brevo'
import { env } from '~/configs/environment'

let apiInstance = new TransactionalEmailsApi()
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  env.BREVO_API_KEY as string
)

const sendEmail = async (
  recipientEmail: string,
  customSubject: string,
  customHtmlContent: string
) => {
  // Create a new instance of the SendSmtpEmail class
  const sendSmtpEmail = new SendSmtpEmail()

  // Set the sender's email and name
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Set the recipient's email
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Set the subject of the email
  sendSmtpEmail.subject = customSubject

  // Set the HTML content of the email
  sendSmtpEmail.htmlContent = customHtmlContent

  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = { sendEmail }
