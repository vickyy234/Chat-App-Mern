import jwt from "jsonwebtoken";

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 days
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
    sameSite: "none",
  });
};

export default generateToken;
