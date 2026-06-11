import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) {
    console.log('[Email skipped - SMTP not configured]', { to, subject });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465, // 587 ki jagah 465 use kar
      secure: true, // 465 ke liye true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Memory Nest <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Forgot Password Error:', error);
    throw error; // Important: error throw kar taki frontend hang na ho
  }
};