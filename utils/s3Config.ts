// utils/s3Config.ts
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "us-east-1", // This is required but might not be used by BTFS
  endpoint: "https://storage3.btfs.io/s3",
  credentials: {
    accessKeyId: '1a3f875c-0597-4675-8f6e-175cb5e13b4d',
    secretAccessKey: 'nZWcK7onbHdxY0rvDf2Y3Z0u2b6KKGSl',
  },
  forcePathStyle: true,
});

export default s3Client;