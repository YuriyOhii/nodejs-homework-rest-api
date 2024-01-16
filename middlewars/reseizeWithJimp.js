import Jimp from "jimp";

const reseizeWithJimp = async (req, res, next) => {
  const { path } = req.file;
  const avatar = await Jimp.read(path);
  avatar.resize(250, 250).write(path);
  next();
};

export default reseizeWithJimp;
