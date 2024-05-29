import bcrypt from 'bcrypt';
import { User } from '../models';
import { generateToken } from '../utils';
import aws from '../utils/aws';

async function getAccountInfo(req, res) {
  res.json(req.user);
}

async function signInWithPassword(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      name: 'MissingCredentialsError',
      message: 'Email and password are required',
    });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(404).json({
      name: 'UserDoesNotExistError',
      message: 'A user with the given email does not exist',
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      name: 'InvalidCredentialsError',
      message: 'Invalid credentials',
    });
  }

  const idToken = generateToken(user);

  return res.json({
    idToken,
    email: user.email,
    localId: user._id,
    registered: true,
    role: user.role,
  });
}

async function signUp(req, res) {
  const { email, password, firstName, lastName, phone } = req.body;
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({
      name: 'MissingCredentialsError',
      message: 'Please provide all required fields',
    });
  }

  const userExists = await User.findOne({ email }).lean();
  if (userExists) {
    return res.status(400).json({
      name: 'UserExistsError',
      message: 'A user with the given email is already registered',
    });
  }

  try {
    const newUser = {
      email,
      password,
      firstName,
      lastName,
      phone,
      profilePicture: {},
    };

    if (req.file) {
      const { name, data, mimetype, size } = req.file;
      const uploadResult = await aws.upload(name, data, { public: true });
      newUser.profilePicture = {
        name: uploadResult.name,
        size,
        type: mimetype,
        url: aws.getPublicUrl(uploadResult.key),
      };
    }

    const user = new User(newUser);
    await user.save();

    const idToken = generateToken(user);

    return res.json({
      idToken,
      email: user.email,
      localId: user._id,
      profilePicture: user.profilePicture.url, // Include profile picture URL in the response
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      name: 'SignUpError',
      message: error.message || 'An error occurred while signing up',
    });
  }
}

export default { getAccountInfo, signInWithPassword, signUp };
