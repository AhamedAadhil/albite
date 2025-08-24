export const RESET_PASSWORD_TEMPLATE = (resetUrl: string, userName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Reset</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #fefefe;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9a826; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #ed1a25; padding: 20px; color: white; text-align: center; font-size: 24px; font-weight: bold;">
              Albite Cloud Kitchen
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
              <p>Hi, ${userName}</p>
              <p>You have requested to reset your password. Click the button below to set a new password:</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" target="_blank" style="background-color: #ed1a25; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Reset Password
                </a>
              </p>

              <p>If the button above does not work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all;"><a href="${resetUrl}" target="_blank" style="color: #f9a826;">${resetUrl}</a></p>

              <p>If you did not request a password reset, please ignore this email or contact support.</p>

              <p>Thanks,<br />The Albite Cloud Support Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9a826; padding: 15px; text-align: center; font-size: 14px; color: #444444;">
              &copy; 2025 Albite Cloud Kitchen. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`;
