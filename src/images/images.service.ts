import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { config } from '@/common/config/config'
import * as sharp from 'sharp'
import { Readable } from 'typeorm/platform/PlatformTools'

@Injectable()
export class ImagesService {
  private s3Client: S3Client

  constructor() {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: config.AWS.S3_BUCKET,
      credentials: {
        accessKeyId: config.AWS.S3_ACCESS_KEY,
        secretAccessKey: config.AWS.S3_SECRET_ACCESS_KEY,
      },
    })
    this.s3Client = s3Client
  }

  async upload(file: Express.Multer.File) {
    try {
      const shortId = Math.random().toString(36).substring(2, 15)

      const key = `sipena/${shortId}`

      const command = new PutObjectCommand({
        Bucket: config.AWS.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })

      await this.s3Client.send(command)

      return `${config.SIPENA_FILES}/${shortId}`
    } catch (error) {
      console.log(error)
    }
  }

  async uploadOtherFiles(file: Buffer, folder?: string, mimetype?: string) {
    const shortId = Math.random().toString(36).substring(2, 15)
    const key = folder ? `sipena/${folder}/${shortId}` : `sipena/${shortId}`

    const command = new PutObjectCommand({
      Bucket: config.AWS.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimetype,
    })

    await this.s3Client.send(command)

    return `${config.SIPENA_FILES}/${folder ? `${folder}/` : ''}${shortId}`
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    const promises = files.map(async file => {
      const shortId = Math.random().toString(36).substring(2, 15)
      const key = `sipena/${shortId}`

      const image = await sharp(file.buffer)
        .webp({ quality: 80 })
        .resize({
          width: 500,
          height: 500,
          fit: 'cover',
        })
        .toBuffer()

      const contentLength = image.byteLength
      const stream = Readable.from(image)

      const command = new PutObjectCommand({
        Bucket: config.AWS.S3_BUCKET_NAME,
        Key: key,
        Body: stream,
        ContentType: file.mimetype,
        ContentLength: contentLength,
      })
      await this.s3Client.send(command)

      console.log(shortId)
      return `${config.SIPENA_FILES}/${shortId}`
    })

    return await Promise.all(promises)
  }
}
