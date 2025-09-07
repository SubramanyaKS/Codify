//C:\Users\Administrator\Codify\server\utils\OTPemailTemplates.js
export const otpEmailTemplate = (otp) => {
  const subject = "Codify verification Code";

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #4f46e5, #3b82f6); color: white; padding: 25px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Codify Email Verification</h2>
      </div>
      
      <!-- Body -->
      <div style="padding: 35px; color: #333; line-height: 1.6; text-align: center;">
        <h3 style="margin-bottom: 15px; font-size: 20px;">Verify Your Email</h3>
        <p style="margin-bottom: 25px; font-size: 15px;">
          To complete your verification on <b>Codify</b>, please use the One-Time Password (OTP) below:
        </p>
        
        <!-- OTP -->
        <div style="font-size: 32px; font-weight: bold; color: #2563eb; background: #f0f9ff; padding: 18px 25px; border-radius: 10px; display: inline-block; letter-spacing: 5px; margin-bottom: 25px;">
          ${otp}
        </div>
        
        <p style="font-size: 14px; color: #555; margin-top: 10px;">
          This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 18px; text-align: center; font-size: 13px; color: #6b7280;">
        Best regards,<br>
        <b>Codify Team</b>
      </div>
    </div>
  </div>
  `;
  return { subject, html };
};
