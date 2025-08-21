import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { StorageService } from '../../common/storage/storage.service';

@Controller('v1/photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService,
    private readonly storageService: StorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body('businessId') businessId?: string,
    @Body('caption') caption?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.storageService.validateFileType(file)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
    }

    if (!this.storageService.validateFileSize(file, 10)) {
      throw new BadRequestException('File size too large. Maximum size is 10MB');
    }

    const { url, key } = await this.storageService.uploadFile(file, 'business-photos');

    return this.photosService.create({
      url,
      storageKey: key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      businessId,
      caption,
    });
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiplePhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('businessId') businessId?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = [];
    const errors = [];

    for (const [index, file] of files.entries()) {
      try {
        if (!this.storageService.validateFileType(file)) {
          errors.push({ index, error: 'Invalid file type' });
          continue;
        }

        if (!this.storageService.validateFileSize(file, 10)) {
          errors.push({ index, error: 'File size too large' });
          continue;
        }

        const { url, key } = await this.storageService.uploadFile(file, 'business-photos');

        const photo = await this.photosService.create({
          url,
          storageKey: key,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          businessId,
          caption: '',
        });

        results.push(photo);
      } catch (error) {
        errors.push({ index, error: error.message });
      }
    }

    return {
      successful: results,
      errors,
      totalUploaded: results.length,
      totalFailed: errors.length,
    };
  }

  @Delete(':id')
  async deletePhoto(@Param('id', ParseUUIDPipe) id: string) {
    const photo = await this.photosService.findOne(id);
    
    // Delete from storage
    if (photo.storageKey) {
      await this.storageService.deleteFile(photo.storageKey);
    }

    return this.photosService.remove(id);
  }
}