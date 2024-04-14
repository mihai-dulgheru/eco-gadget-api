import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  const payload = {
    localId: user._id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

export default generateToken;
