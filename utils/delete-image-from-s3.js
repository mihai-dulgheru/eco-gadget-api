import { basename } from 'path';
import aws from './aws';

async function deleteImageFromS3(imageUrl) {
  const key = basename(imageUrl);
  await aws.remove(key);
}

export default deleteImageFromS3;
