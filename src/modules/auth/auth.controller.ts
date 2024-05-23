import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { CloudinaryMulterConfigService } from 'middleware/cloudinary.middleware.service';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private readonly cloudaryService: CloudinaryMulterConfigService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Register new user',
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: File,
  ) {
    const { username, email, password } = createUserDto;
    const existingUser = await this.userService.findByEmail(email);

    let avatarUrl = '';
    if (avatar) {
      const fileData = avatar?.buffer?.toString('base64');
      avatarUrl = await this.cloudaryService.uploadToCloudinary(
        `data:${avatar.mimetype};base64,${fileData}`,
      );
    }
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    return this.userService.register(username, email, password, avatarUrl);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
