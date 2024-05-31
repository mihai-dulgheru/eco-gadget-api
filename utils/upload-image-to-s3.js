import aws from './aws';

async function uploadImageToS3(file) {
  if (file) {
    const { originalname, buffer } = file;
    const result = await aws.upload(originalname, buffer, { public: true });
    return aws.getPublicUrl(result.key);
  }
  return '';
}

export default uploadImageToS3;
