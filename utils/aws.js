import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { basename, extname } from 'path';

// Get environment variables
const bucket = process.env.DO_SPACES_BUCKET;
const folder = process.env.DO_SPACES_FOLDER;
const region = process.env.DO_SPACES_REGION;

// Create a new S3 client
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
  },
  endpoint: 'https://eco-gadget.fra1.digitaloceanspaces.com', // 'https://eco-gadget.s3.eu-north-1.amazonaws.com'
  forcePathStyle: false,
  region,
});

// Upload file to AWS
const upload = async (filename, data, options = {}) => {
  const key = createKey(filename);

  const params = {
    Body: data,
    Bucket: bucket,
    Key: `${folder}/${key}`,
  };

  // Set public access
  if (options?.public) {
    params.ACL = 'public-read';
  }

  const command = new PutObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    return { data, key: getKey(params.Key), name: getName(params.Key) };
  } catch (err) {
    console.error('Error uploading to DigitalOcean', err);
    throw err;
  }
};

// Remove file from AWS
const remove = async (filename) => {
  const params = {
    Bucket: bucket,
    Key: `${folder}/${filename}`,
  };

  const command = new DeleteObjectCommand(params);
  try {
    return await s3Client.send(command);
  } catch (err) {
    console.error('Error removing from DigitalOcean', err);
    throw err;
  }
};

// Get all files from a folder in AWS
const getFiles = async (folder) => {
  const params = {
    Bucket: bucket,
  };

  const command = new ListObjectsV2Command(params);
  try {
    let isTruncated = true;
    let files = [];
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3Client.send(command);
      const contentsList = Contents.map((c) => c.Key).filter((key) =>
        key.includes(folder)
      );
      files = [...files, ...contentsList];
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    return files;
  } catch (err) {
    console.error('Error getting files from DigitalOcean', err);
    throw err;
  }
};

// Remove folder from AWS
const removeFolder = async (folder) => {
  const files = await getFiles(folder);
  const params = {
    Bucket: bucket,
  };

  try {
    for (const file of files) {
      params.Key = file;
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
    }
  } catch (error) {
    console.error('Error removing folder from DigitalOcean', error);
    throw error;
  }
};

// Remove file from AWS
const removeFile = async (key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  try {
    return await s3Client.send(command);
  } catch (err) {
    console.error('Error removing from DigitalOcean', err);
    throw err;
  }
};

// Create a key for the file
const createKey = (filename) => {
  const extension = extname(filename);
  const timestamp = Date.now();
  const normalized = filename.toLowerCase().replaceAll(' ', '-');
  const file = normalized.replace(extension, '');

  return `${file}-${timestamp}${extension}`;
};

// Get the key of the file
const getKey = (path) => {
  return basename(path);
};

// Get the public URL of the file
const getPublicUrl = (filename) => {
  return `https://${bucket}.${region}.digitaloceanspaces.com/${filename}`;
};

// Get the name of the file
const getName = (filename) => {
  const extension = extname(filename);
  const file = basename(filename, extension);
  const timestamp = file.split('-').pop();
  const name = file.replace(`-${timestamp}`, '');
  return `${name}${extension}`;
};

// Download file from AWS
const download = async (filename) => {
  const params = {
    Bucket: bucket,
    Key: `${folder}/${filename}`,
  };

  const command = new GetObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    const data = await new Promise((resolve, reject) => {
      const chunks = [];
      response.Body.on('data', (chunk) => chunks.push(chunk));
      response.Body.on('error', (err) => reject(err));
      response.Body.on('end', () => resolve(Buffer.concat(chunks)));
    });
    return data;
  } catch (err) {
    console.error('Error downloading from DigitalOcean', err);
    throw err;
  }
};

export default {
  download,
  getFiles,
  getKey,
  getPublicUrl,
  remove,
  removeFile,
  removeFolder,
  upload,
};
