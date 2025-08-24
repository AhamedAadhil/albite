import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:
    process.env.NODE_ENV === "production"
      ? process.env.EMAIL_HOST_PRODUCTION
      : process.env.EMAIL_HOST,
  port:
    process.env.NODE_ENV === "production"
      ? parseInt(process.env.EMAIL_PORT_PRODUCTION!)
      : parseInt(process.env.EMAIL_PORT!),
  secure: process.env.NODE_ENV === "production",
  auth: {
    user:
      process.env.NODE_ENV === "production"
        ? process.env.EMAIL_USER_PRODUCTION
        : process.env.EMAIL_USER,
    pass:
      process.env.NODE_ENV === "production"
        ? process.env.EMAIL_PASS_PRODUCTION
        : process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param to - Recipient email
 * @param subject - Email subject
 * @param html - Email body in HTML format
 * @returns Promise<{ success: boolean; message?: string; error?: any }>
 */

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; message?: string; error?: any }> => {
  try {
    const mailOptions = {
      from: `"Albite Support" <${
        process.env.NODE_ENV === "production"
          ? process.env.EMAIL_USER_PRODUCTION
          : process.env.EMAIL_USER
      }>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    return { success: false, error };
  }
};
