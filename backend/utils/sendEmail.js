import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) {
    console.log('[Email skipped - SMTP not configured]', { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `MemoryNest <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log('Email sent to:', to);
};