import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
export async function uploadFile(file: any) {
  if (file) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams: any = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: fileStream,
    }
    const uploadedFile = await s3.upload(uploadParams).promise()
    return uploadedFile
  }
  return new Error("Payload not found")
}

// downloads a file from s3
export function getFileStream(fileKey: any, fileType?: string) {
  if (fileKey) {
    const downloadParams: any = {
      Key: fileKey,
      Bucket: bucketName
    }
    if (fileType === "resume") {
      return s3.getSignedUrl('getObject', downloadParams)
    } else {
      return s3.getObject(downloadParams).createReadStream()
    }
  }
  return new Error("Payload not found")
}

// Get file signed url
export function getFileUrl(fileKey: any) {
  if (fileKey) {
    const downloadParams: any = {
      Key: fileKey,
      Bucket: bucketName
    }
      return s3.getSignedUrl('getObject', downloadParams)
  }
  return new Error("Payload not found").toString()
}

// Delete a file in s3
export function deleteFile(fileKey: any) {
  if (fileKey) {
    const deleteParams: any = {
      Bucket: bucketName,
      Key: fileKey
    }
    return s3.deleteObject(deleteParams).promise()
  }
  return new Error("Payload not found")
}
