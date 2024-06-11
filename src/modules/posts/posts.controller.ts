import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { CloudinaryMulterConfigService } from 'middleware/cloudinary.middleware.service';
import { CurrentUser } from 'common/decorations';
import { SearchQueryDto } from 'base/query/search.query';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudaryService: CloudinaryMulterConfigService,
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
    @CurrentUser() userId: string,
  ) {
    try {
      if (!userId) {
        return new HttpException(
          'Failed to create post',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { title, content, category } = createPostDto;
      const fileData = banner?.buffer?.toString('base64');

      const bannerUrl = await this.cloudaryService.uploadToCloudinary(
        `data:${banner.mimetype};base64,${fileData}`,
      );
      return this.postsService.create(
        {
          title,
          content,
          banner: bannerUrl,
          category,
        },
        userId,
      );
    } catch (error) {
      return new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/query')
  @ApiOperation({
    summary: 'Search post by content',
  })
  async queryByContent(@Query() query: SearchQueryDto) {
    return await this.postsService.searchPosts(query);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all post',
  })
  async getAllPost(@Query() query: PostQueryDto) {
    return await this.postsService.findAll(query);
  }

  @Roles(Role.USER)
  @Get(':id')
  @ApiOperation({
    summary: 'Get detail post',
  })
  async getPostDetail(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }
}
