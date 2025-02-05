import nodeMailer from "nodemailer";

//* Utility function to send email
const sendMail = async ({ to, subject, content, isHtml = false }) => {
  // create a transporter
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const mailOptions = {
    from: "Blog Horizon " + process.env.SMTP_EMAIL,
    to,
    subject,
    [isHtml ? "html" : "text"]: content,
  };

  // send mail
  await transporter.sendMail(mailOptions);
};

export { sendMail };
