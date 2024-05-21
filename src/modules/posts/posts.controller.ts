import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { File } from 'multer';
import { Role, Roles } from '../../config/role';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { PostQueryDto } from '../../base';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService,
  ) {}

  @Roles(Role.USER)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'User create post',
  })
  @UseInterceptors(FileInterceptor('banner'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() banner: File,
    @Req() req: any,
  ) {
    const token = req.headers['authorization'].split(' ')[1];
    const decodedToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const userId = decodedToken.userId;
    const { title, content, categoryId } = createPostDto;
    const fileData = banner?.buffer?.toString('base64');

    const bannerUrl = await this.uploadToCloudinary(
      `data:${banner.mimetype};base64,${fileData}`,
    );
    return this.postsService.create(
      {
        title,
        content,
        banner: bannerUrl,
        categoryId,
      },
      userId,
    );
  }

  async uploadToCloudinary(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath);
      return result.secure_url;
    } catch (error) {
      return '';
    }
  }
  @Roles(Role.USER)
  @Get()
  @ApiOperation({
    summary: 'Get all post',
  })
  async getAllPost(@Query() query: PostQueryDto) {
    return await this.postsService.findAll(query);
  }
}
