import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mime from 'mime-types';

@Injectable()
export class S3MediaService {
  private readonly bucketName = 'test-bucket';
  private s3Client: S3Client;
  private readonly stsClient = new STSClient({ region: 'us-east-1' });
  private readonly aws_region: string;
  private s3ClientExpiryDate = new Date(0);

  private readonly baseFolderKey: string;
  private readonly presignedUrlExpiresIn = 3600;
  private readonly cloudFrontDomain: string;
  private readonly roleArn: string;

  constructor(configService: ConfigService) {
    this.baseFolderKey = configService.getOrThrow('AWS_S3_BASE_FOLDER') + '/';
    this.roleArn = configService.getOrThrow('AWS_ROLE_ARN');
    this.cloudFrontDomain = configService.getOrThrow('AWS_CLOUDFRONT_DOMAIN');

    this.aws_region = configService.get('AWS_REGION');
    this.s3Client = new S3Client({
      region: this.aws_region, //EX. us-east-1
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  private async getClient(): Promise<S3Client> {
    if (Date.now() > this.s3ClientExpiryDate.valueOf()) {
      const response = await this.stsClient.send(
        new AssumeRoleCommand({
          RoleArn: '',
          RoleSessionName: `test-${Date.now()}`,
          DurationSeconds: 1800,
        }),
      );

      this.s3ClientExpiryDate = response.Credentials.Expiration;

      this.s3Client = new S3Client({
        region: this.stsClient.config.region,
        credentials: {
          accessKeyId: response.Credentials.AccessKeyId,
          secretAccessKey: response.Credentials.SecretAccessKey,
          sessionToken: response.Credentials.SessionToken,
        },
      });
    }

    return this.s3Client;
  }

  async uploadFile(input: {
    file: Express.Multer.File;
    id: string;
    makePublic: boolean;
  }) {
    const { file, id, makePublic = true } = input;
    const fileKey = `${id}-${file.originalname}`;

    const uploadParam: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ACL: makePublic ? 'public-read' : undefined,
      ContentType: mime.lookup(file.mimetype) || 'application/octet-stream',
    };

    await this.s3Client.send(new PutObjectCommand(uploadParam));
    return this.getFileUrl(fileKey);
  }

  async retrieveFile(fileKey: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      const response = await this.s3Client.send(command);
      return response.Body as ReadableStream;
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  }

  async deleteFile(fileKey: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      await this.s3Client.send(command);

      return `File with key "${fileKey}" has been deleted.`;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  private getFileUrl(fileKey: string): string {
    return `https://${this.bucketName}.s3.${this.aws_region}.amazonaws.com/${fileKey}`;
  }
}
