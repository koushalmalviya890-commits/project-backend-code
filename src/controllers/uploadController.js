const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getExtension = (fileType) => {
  const extensions = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
  };
  return extensions[fileType] || "";
};

// Use 'exports.functionName' instead of 'export const functionName'
exports.createUploadUrl = async (req, res) => {
  try {
    const { fileType } = req.body;
    if (!fileType) return res.status(400).json({ error: "fileType required" });

    const ext = getExtension(fileType);
    const key = crypto.randomBytes(16).toString("hex") + ext;
    console.log('Generated key:', key);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    
      ContentType: fileType,
    });
    console.log('Created PutObjectCommand:', command);

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    console.log('Generated signed URL:', url);
    res.json({ url, key });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create upload URL" });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "key required" });

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
     console.log('Created DeleteObjectCommand:', command);
     console.log('Deleting file with key:', command.key);
    await s3Client.send(command);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
