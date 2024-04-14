import { User } from '../../models';

async function signUp(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export default signUp;
