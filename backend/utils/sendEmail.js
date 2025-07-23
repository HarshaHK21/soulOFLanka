const nodemailer = require('nodemailer');

// Create a transporter using your email service details
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or 'outlook', 'yahoo', etc. or an SMTP host
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env
    pass: process.env.EMAIL_PASS, // Your email password (or App Password for Gmail) from .env
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to,                      // List of recipients
      subject: subject,            // Subject line
      text: text,                  // Plain text body
      html: html,                  // HTML body
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // For testing with ethereal.email
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;