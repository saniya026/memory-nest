import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER) {
    console.log('[Email skipped - EMAIL_USER not configured]', { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `Memory Nest <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log('Email sent to:', to);
};