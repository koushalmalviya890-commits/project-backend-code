
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand, GetObjectCommand  } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a PDF buffer to S3 and returns a signed URL for download.
 * @param buffer - PDF Buffer
 * @param fileName - Filename without extension
 * @returns A signed URL to download the uploaded PDF
 */
async function uploadPdfToS3(buffer, fileName) {
  const key = `${fileName}-${uuidv4()}.pdf`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf',
    ContentDisposition: `attachment; filename="${fileName}.pdf"`, // Force download
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: uploadParams.Bucket, Key: uploadParams.Key }),
    { expiresIn: 60 * 60 } // URL valid for 1 hour
  );
}

module.exports = { uploadPdfToS3 };
