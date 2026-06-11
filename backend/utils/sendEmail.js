// utils/sendEmail.js

export const sendEmail = async ({ to, subject, html }) => {
  // 1. Check if Resend key hai ya nahi
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email skipped - RESEND_API_KEY not configured]', { to, subject });
    return;
  }

  try {
    // 2. Resend API ko call kar
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Memory Nest <onboarding@resend.dev>',
        to: [to],
        subject,
        html
      })
    });

    // 3. Agar Resend error de to throw kar
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to send email');
    }

    const data = await res.json();
    console.log('Email sent successfully:', data.id);

  } catch (error) {
    console.error('Resend Error:', error.message);
    throw error; // Ye zaroori hai taki frontend hang na ho
  }
};