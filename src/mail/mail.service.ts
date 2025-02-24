import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: './verify-email',
      context: { verificationUrl },
    })
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3000/api/auth/reset-password?token=${token}`

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './reset-password',
      context: { resetUrl },
    })
  }
}
