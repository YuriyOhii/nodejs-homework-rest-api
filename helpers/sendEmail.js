import nodemailer from "nodemailer";
import "dotenv/config";

const { VALID_EMAIL, EMAIL_KEY } = process.env;

const sendEmail = (data) => {
  const mailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: VALID_EMAIL,
      pass: EMAIL_KEY,
    },
  };

  const transport = nodemailer.createTransport(mailerConfig);

  const email = { ...data, from: VALID_EMAIL };
  transport.sendMail(email);
};

export default sendEmail;
