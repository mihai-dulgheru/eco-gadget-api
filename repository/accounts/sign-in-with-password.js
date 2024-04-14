import bcrypt from 'bcrypt';
import { User } from '../../models';

async function signInWithPassword(userData) {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export default signInWithPassword;
