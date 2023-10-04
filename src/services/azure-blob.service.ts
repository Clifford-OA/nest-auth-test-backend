import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name);
  private readonly azureConnectionString = process.env.AZURE_CONNECTION_STRING;
  private readonly containerName = 'azure-test';

  // upload file
  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnectionString,
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file: Express.Multer.File) {
    const date = Date.now();
    const blobClient = this.getBlobClient(date + file.originalname);
    await blobClient.uploadData(file.buffer);
    this.logger.log('uploading.....');
    return blobClient.url;
  }
}
