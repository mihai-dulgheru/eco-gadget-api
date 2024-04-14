import { User } from '../../models';
import { generateToken } from '../../utils';

async function signUp(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      name: 'MissingCredentialsError',
      message: 'Email and password are required',
    });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      name: 'UserExistsError',
      message: 'A user with the given email is already registered',
    });
  }

  try {
    const user = new User({ email, password });
    await user.save();
    const idToken = generateToken(user);

    return res.json({
      idToken,
      email: user.email,
      localId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      name: 'SignUpError',
      message: error.message || 'An error occurred while signing up',
    });
  }
}

export default signUp;
