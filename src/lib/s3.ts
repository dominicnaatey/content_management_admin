import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s/g, "-")}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return the public URL
  // Assuming the bucket is public or there is a public domain configured
  // If R2_PUBLIC_URL is set, use it, otherwise fallback to endpoint (which might not work for public access directly depending on config)
  const publicUrl = process.env.R2_PUBLIC_URL 
    ? `${process.env.R2_PUBLIC_URL}/${filename}`
    : `${process.env.R2_ENDPOINT}/${filename}`; // This is a fallback, might need adjustment based on user setup

  return publicUrl;
}
