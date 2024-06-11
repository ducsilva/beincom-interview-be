import {
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AllExceptionsFilter } from 'exception';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryMulterConfigService } from 'middleware/cloudinary.middleware.service';
import { File } from 'multer';
import { CurrentUser } from 'common/decorations';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cloudaryService: CloudinaryMulterConfigService,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get profile',
  })
  async getProfile(@Req() req: any) {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findByEmailExceptPass(
        decodedToken.email,
      );
      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }

      return user;
    } catch (error) {
      throw new AllExceptionsFilter();
    }
  }

  @ApiBody({
    description: 'Upload Avatar',
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload avatar new user',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('upload-avatar')
  async register(@UploadedFile() avatar: File, @CurrentUser() userId: string) {
    let avatarUrl = '';
    if (!userId) {
      throw new UnauthorizedException('User not found!');
    }
    if (avatar) {
      const fileData = avatar?.buffer?.toString('base64');
      avatarUrl = await this.cloudaryService.uploadToCloudinary(
        `data:${avatar.mimetype};base64,${fileData}`,
      );
    }

    return this.userService.updateUser(userId, { avatar: avatarUrl });
  }
}
