import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { StorageModule } from '../../common/storage/storage.module';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [
    MulterModule.register({
      storage: 'memory', // Store in memory for processing
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10, // Max 10 files
      },
    }),
    StorageModule,
    PrismaModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}