import { User } from '../../models';
import aws from '../../utils/aws';

// Update a user
async function updateUser(req, res) {
  const { _id } = req.user;
  const updateData = req.body;

  // Check if there's a file to upload
  if (req.file) {
    try {
      const { name, data, mimetype } = req.file;
      const uploadResult = await aws.upload(name, data, { public: true });
      updateData.profilePicture = {
        name: uploadResult.name,
        size: req.file.size,
        type: mimetype,
        url: aws.getPublicUrl(uploadResult.key),
      };
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error uploading file to S3', error });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
}

export default updateUser;
