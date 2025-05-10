import { IUser } from "../user/interface/Iuser.interface";

export class EmailService {
  private static instance: EmailService;

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendPasswordResetEmail(user: IUser, resetToken: string): Promise<void> {
    // In a real application, this would send an actual email
    // For now, we'll just log the email details
    console.log(`
      Password Reset Email:
      To: ${user.email}
      Subject: Password Reset Request
      Body: 
      Hello ${user.name},
      
      You have requested to reset your password. Please use the following token to reset your password:
      
      ${resetToken}
      
      This token will expire in 1 hour.
      
      If you did not request this password reset, please ignore this email.
      
      Best regards,
      Your App Team
    `);
  }

  async sendPasswordChangedEmail(user: IUser): Promise<void> {
    console.log(`
      Password Changed Email:
      To: ${user.email}
      Subject: Password Changed Successfully
      Body:
      Hello ${user.name},
      
      Your password has been successfully changed.
      
      If you did not make this change, please contact support immediately.
      
      Best regards,
      Your App Team
    `);
  }
}
