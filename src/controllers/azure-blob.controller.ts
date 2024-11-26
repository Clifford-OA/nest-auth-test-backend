import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProtectedApi } from 'src/decorators/protected-api.decorator';
import { AzureBlobService } from 'src/services/azure-blob.service';

@Controller('/azure')
@ApiTags('Azure uploads')
@ProtectedApi()
export class AzureBlobController {
  constructor(private readonly azureBlobService: AzureBlobService) {}

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        name: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload file here' })
  async azureUploadFile(@UploadedFile() image?: Express.Multer.File) {
    return await this.azureBlobService.upload(image);
  }

  @Post('/s3/upload-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        name: { type: 'string' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload file to s3 test' })
  async s3UploadFile(@UploadedFile() image?: Express.Multer.File) {
    return await this.azureBlobService.upload(image);
  }
}
