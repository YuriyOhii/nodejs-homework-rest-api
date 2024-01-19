import "dotenv/config";

const { HOST_ADDRESS } = process.env;

const getVerifyEmail = (to, verificationToken) => {
  const verificationEmail = {
    to: to,
    subject: "Verification email",
    html: `<a target=_blank href="${HOST_ADDRESS}/api/users/verify/${verificationToken}"
        >Click here to verify your email</a>`,
  };
  return verificationEmail;
};

export default getVerifyEmail;
