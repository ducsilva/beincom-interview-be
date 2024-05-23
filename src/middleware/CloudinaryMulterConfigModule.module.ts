import { Module } from '@nestjs/common';
import { CloudinaryMulterConfigService } from './cloudinary.middleware.service';

@Module({
  providers: [CloudinaryMulterConfigService],
  exports: [CloudinaryMulterConfigService],
})
export class CloudinaryMulterConfigModule {}
