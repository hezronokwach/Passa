import nodemailer = require('nodemailer');
import { SentMessageInfo } from 'nodemailer';

// Email configuration from environment variables
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || '',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  from: process.env.EMAIL_FROM || 'Passa <noreply@passa.com>',
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: EMAIL_CONFIG.secure,
  auth: EMAIL_CONFIG.auth,
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

/**
 * Send an email using the configured transporter
 * @param options Email options including recipient, subject, and content
 * @returns Promise resolving to the sent message info
 */
export async function sendEmail(options: EmailOptions): Promise<SentMessageInfo> {
  // Skip sending emails in development if no email config is provided
  if (
    process.env.NODE_ENV === 'development' &&
    (!EMAIL_CONFIG.host || !EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass)
  ) {
    console.warn('Email configuration not provided. Skipping email send in development.');
    console.log('Email content:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Text:', options.text);
    console.log('HTML:', options.html?.substring(0, 200) + '...');
    return { messageId: 'dev-mode' } as SentMessageInfo;
  }

  const mailOptions = {
    from: EMAIL_CONFIG.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send a verification email to a user
 * @param email Recipient email address
 * @param token Verification token
 * @param name User's name (optional)
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string
): Promise<void> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Passa${name ? `, ${name}` : ''}!</h2>
      <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #0070f3; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 14px;">
        If you didn't sign up for a Passa account, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify your Passa account',
    html,
  });
}

/**
 * Send a password reset email to a user
 * @param email Recipient email address
 * @param token Password reset token
 * @param name User's name (optional)
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset your Passa password</h2>
      <p>Hello${name ? ` ${name}` : ''}!</p>
      <p>We received a request to reset your Passa account password. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #0070f3; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 14px;">
        This email was sent to ${email} because someone requested a password reset for this account.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset your Passa password',
    html,
  });
}

/**
 * Send a ticket purchase confirmation email
 * @param email Recipient email address
 * @param eventName Name of the event
 * @param ticketDetails Details about the purchased ticket
 * @param qrCodeData Base64 encoded QR code data
 */
export async function sendTicketConfirmationEmail(
  email: string,
  eventName: string,
  ticketDetails: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  },
  qrCodeData?: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Passa Ticket Confirmation</h2>
      <p>Thank you for your purchase!</p>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event: ${eventName}</h3>
        <p><strong>Ticket Type:</strong> ${ticketDetails.name}</p>
        <p><strong>Price:</strong> $${ticketDetails.price.toFixed(2)}</p>
        <p><strong>Quantity:</strong> ${ticketDetails.quantity}</p>
      </div>
      ${
        qrCodeData
          ? `<div style="text-align: center; margin: 30px 0;">
              <img src="data:image/png;base64,${qrCodeData}" alt="Ticket QR Code" style="max-width: 200px;">
              <p style="color: #666; font-size: 14px;">Scan this QR code at the event entrance</p>
            </div>`
          : ''
      }
      <p>Please keep this email and QR code handy for event entry.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 14px;">
        If you have any questions about your ticket, contact our support team.
      </p>
    </div>
  `;

  const attachments = qrCodeData
    ? [
        {
          filename: 'ticket-qr.png',
          content: Buffer.from(qrCodeData, 'base64'),
        },
      ]
    : [];

  await sendEmail({
    to: email,
    subject: `Your Ticket for ${eventName}`,
    html,
    attachments,
  });
}