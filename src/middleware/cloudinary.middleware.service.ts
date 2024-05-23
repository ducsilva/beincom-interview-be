// cloudinary.middleware.ts
import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { extname } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `${process.cwd()}/.env`,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryMulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        // destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    };
  }

  async uploadToCloudinary(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath);
      return result.secure_url;
    } catch (error) {
      return '';
    }
  }
}
