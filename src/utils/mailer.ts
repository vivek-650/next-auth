import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

interface EmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailParams) => {
  try {
    const hasedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verificationToken: hasedToken,
          verificationTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          ForgotPasswordToken: hasedToken,
          ForgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "da5ac6423c14db",
        pass: "d15d9fa5b0743a",
      },
    });

    const mailOptions = {
      from: '"Vivek Anand" <vivek66anand@gmail.com>',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verify-email" : "reset-password"
      }?token=${hasedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }. This link will expire in 1 hour. OR copy the link below:</p><p>${
        process.env.DOMAIN
      }/${
        emailType === "VERIFY" ? "verify-email" : "reset-password"
      }?token=${hasedToken}</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};
