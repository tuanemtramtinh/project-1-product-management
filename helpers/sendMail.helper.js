const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, content) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: content,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
