import { User } from '../../models';
import aws from '../../utils/aws';

// Delete a user
async function deleteUser(req, res) {
  const { _id } = req.user;

  // Optionally, delete the profile picture from S3 if exists
  try {
    const user = await User.findById(_id).lean();
    if (user && user.profilePicture && user.profilePicture.url) {
      await aws.remove(aws.getKey(user.profilePicture.url));
    }

    await User.findByIdAndDelete(_id);
    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
}

export default deleteUser;
