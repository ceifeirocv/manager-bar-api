import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import * as dotenv from "dotenv";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

dotenv.config();

const mailerSend = new MailerSend({
  apiKey:
    process.env.MAILERSEND_API_KEY ||
    "apikey-mlsn.cb034321de8857846b6431aca458d16c436bd2639f0f125e61369236a16a543c",
});

const defaultSender = {
  email: process.env.EMAIL_FROM || "auth@yourdomain.com",
  name: process.env.EMAIL_FROM_NAME || "Your App",
};

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),

  emailAndPassword: {
    enabled: true,
    verifyEmail: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        // Create email parameters
        const emailParams = new EmailParams()
          .setFrom(new Sender(defaultSender.email, defaultSender.name))
          .setTo([new Recipient(user.email)])
          .setSubject("Reset your password")
          .setHtml(
            `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password:</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
          `
          )
          .setText(
            `Reset your password by clicking this link: ${url}\n\nIf you didn't request this, you can safely ignore this email.\n\nThis link will expire in 1 hour.`
          );

        // Send the email
        await mailerSend.email.send(emailParams);
        console.log(`Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const emailParams = new EmailParams()
          .setFrom(new Sender(defaultSender.email, defaultSender.name))
          .setTo([new Recipient(user.email)])
          .setSubject("Verify your email address")
          .setHtml(
            `
            <h1>Verify your email address</h1>
            <p>Click the link below to verify your email address:</p>
            <p><a href="${url}">${url}</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          `
          )
          .setText(`Verify your email address by clicking this link: ${url}`);

        // Send the email
        await mailerSend.email.send(emailParams);
        console.log(`Verification email sent to ${user.email}`);
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
      }
    },
  },

  // Base URL for auth endpoints
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

// Export auth API for use in routes
export const { api } = auth;
