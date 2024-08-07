import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import { PasswordReset, User } from '../models';
import { generateToken, generateUniqueResetCode } from '../utils';
import aws from '../utils/aws';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = await generateUniqueResetCode();
    const expirationTime = new Date(Date.now() + 3600000); // Code expires in 1 hour

    await PasswordReset.create({
      email,
      code: resetCode,
      expiresAt: expirationTime,
    });

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Resetare parolă',
      text: `Codul tău de resetare a parolei este: ${resetCode}`,
      html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resetare parolă</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      box-sizing: border-box;
    "
  >
    <div
      style="
        background-color: #f2f2f2;
        padding: 20px;
        max-width: 640px;
        margin: 0 auto;
      "
    >
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px">
        <img
          src="https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/icon.png"
          alt="EcoGadget Logo"
          style="display: block; margin: 0 auto 20px auto; max-width: 100px"
        />
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Codul tău de resetare a parolei este:
        </p>
        <p
          style="
            color: #030303;
            font-size: 16px;
            margin-bottom: 20px;
            font-weight: bold;
          "
        >
          ${resetCode}
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest
          email.
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Cu respect,
        </p>
        <p style="color: #030303; font-size: 16px; font-weight: bold">
          Echipa EcoGadget
        </p>
      </div>
    </div>
  </body>
</html>
`,
    };
    await sgMail.send(msg);

    res.status(200).json({ email });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error sending password reset email', error });
  }
}

async function getAccountInfo(req, res) {
  res.json(req.user);
}

async function resetPassword(req, res) {
  const { email, code, password, confirmPassword } = req.body;

  if (!email || !code || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  if (isNaN(code)) {
    return res.status(400).json({ message: 'Invalid reset code' });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Passwords do not match. Please try again' });
  }

  try {
    const reset = await PasswordReset.findOne({ email, code }).lean();
    if (!reset) {
      return res.status(404).json({ message: 'Reset code not found' });
    }

    if (reset.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    await PasswordReset.deleteOne({ email, code });

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: 'Confirmare resetare parolă',
      text: 'Parola ta a fost resetată cu succes.',
      html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmare resetare parolă</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      box-sizing: border-box;
    "
  >
    <div
      style="
        background-color: #f2f2f2;
        padding: 20px;
        max-width: 640px;
        margin: 0 auto;
      "
    >
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px">
        <img
          src="https://eco-gadget.s3.eu-north-1.amazonaws.com/assets/icon.png"
          alt="EcoGadget Logo"
          style="display: block; margin: 0 auto 20px auto; max-width: 100px"
        />
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Parola ta a fost resetată cu succes.
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Dacă nu ai solicitat resetarea parolei, te rugăm să contactezi echipa
          de suport.
        </p>
        <p style="color: #030303; font-size: 16px; margin-bottom: 20px">
          Cu respect,
        </p>
        <p style="color: #030303; font-size: 16px; font-weight: bold">
          Echipa EcoGadget
        </p>
      </div>
    </div>
  </body>
</html>
`,
    };
    await sgMail.send(msg);

    const idToken = generateToken(user);

    return res.json({
      idToken,
      email: user.email,
      localId: user._id,
      registered: true,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
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

async function verifyResetCode(req, res) {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ message: 'Please provide both email and code' });
  }

  if (isNaN(code)) {
    return res.status(400).json({ message: 'Invalid reset code' });
  }

  try {
    const reset = await PasswordReset.findOne({ email, code }).lean();
    if (!reset) {
      return res.status(404).json({ message: 'Reset code not found' });
    }

    if (reset.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    res.status(200).json({ email, code });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying reset code', error });
  }
}

export default {
  forgotPassword,
  getAccountInfo,
  resetPassword,
  signInWithPassword,
  signUp,
  verifyResetCode,
};
