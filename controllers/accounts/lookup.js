import { User } from '../../models';

async function getAccountInfo(req, res) {
  try {
    const userId = req.user.localId;
    if (!userId) {
      return res
        .status(400)
        .json({ name: 'MissingUserIdError', message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ name: 'UserNotFoundError', message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res
      .status(500)
      .json({ name: 'InternalError', message: 'Internal server error' });
  }
}

export default getAccountInfo;
