import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure transporter (Update these details with your email service credentials)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // Use secure setting from environment variable
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app-specific password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Function to send approval request email
export const sendApprovalRequestEmail = async (superadminEmail, pendingUser) => {
  try {
    // Use the backend URL for the approval link
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const approvalLink = `${backendUrl}/api/auth/approve/${pendingUser.approvalToken}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Admin Registration Approval Request</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #007bff; color: #ffffff; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .button-container { text-align: center; margin-top: 20px; }
          .footer { margin-top: 20px; text-align: center; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AcrossMedia Admin Portal</h1>
            <h2>New Admin Registration - Approval Required</h2>
          </div>
          <div class="content">
            <p>Dear Superadmin,</p>
            <p>A new admin has registered and is awaiting your approval. Please review the details below:</p>
            <ul style="list-style-type: none; padding: 0;">
              <li><strong>Username:</strong> ${pendingUser.username}</li>
              <li><strong>Email:</strong> ${pendingUser.email}</li>
              <li><strong>Registration Date:</strong> ${new Date(pendingUser.createdAt).toLocaleString()}</li>
            </ul>
            <div class="button-container">
              <a href="${approvalLink}" class="button">Review & Approve</a>
            </div>
            <p>If the link above doesn't work, copy and paste this URL into your browser:</p>
            <p><a href="${approvalLink}">${approvalLink}</a></p>
          </div>
          <div class="footer">
            <p>This email was sent from AcrossMedia Admin Portal. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER, // Use EMAIL_USER as sender if EMAIL_FROM is not set
      to: superadminEmail,
      subject: 'New Admin Registration - Approval Required',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log(`Approval request email sent to ${superadminEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending approval request email to ${superadminEmail}:`, error);
    throw error;
  }
};

// Function to send approval notification email
export const sendApprovalNotification = async (userEmail, username) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Account Approved</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #28a745; color: #ffffff; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .button-container { text-align: center; margin-top: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Approved</h1>
          </div>
          <div class="content">
            <p>Dear ${username},</p>
            <p>Your account has been approved. You can now log in as an admin.</p>
            <div class="button-container">
              <a href="${process.env.CLIENT_URL}/admin/login" class="button">Login to Admin Portal</a>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from AcrossMedia Admin Portal. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER, // Use EMAIL_USER as sender if EMAIL_FROM is not set
      to: userEmail,
      subject: 'AcrossMedia Admin Account Approved',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Approval notification email sent to ${userEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending approval notification email to ${userEmail}:`, error);
    throw error;
  }
};
