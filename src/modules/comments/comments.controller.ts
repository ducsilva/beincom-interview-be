import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { PostsService } from 'modules/posts/posts.service';
import { Role, Roles } from 'config/role';
import { CurrentUser } from 'common/decorations';

@Controller('comments')
@ApiBearerAuth()
@ApiTags('Comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly jwtService: JwtService,
    private readonly postsService: PostsService,
  ) {}

  @Roles(Role.USER)
  @Post()
  @ApiOperation({
    summary: 'User create comment',
  })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() userId: string,
  ) {
    try {
      if (!userId) {
        return new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const post = await this.postsService.findOne(createCommentDto?.postId);
      if (!post) {
        return new HttpException('Post not found', HttpStatus.BAD_REQUEST);
      }
      return this.commentsService.create(createCommentDto, userId);
    } catch (error) {}
  }

  @Roles(Role.USER)
  @ApiOperation({
    summary: 'User update comment',
  })
  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() userId: string,
  ) {
    try {
      if (!userId) {
        return new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const comment = await this.commentsService.findOne(id);
      if (!comment) {
        return new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
      }
      if (comment?.userId?.id.toString() !== userId) {
        return new HttpException(
          'You are not allowed to update this comment',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.commentsService.update(id, updateCommentDto);
    } catch (error) {
      return new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.USER)
  @ApiOperation({
    summary: 'User delete comment',
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() userId: string) {
    try {
      if (!userId) {
        return new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const comment = await this.commentsService.findOne(id);
      if (!comment) {
        return new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
      }
      if (comment?.userId?.id?.toString() !== userId) {
        return new HttpException(
          'You are not allowed to update this comment',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.commentsService.remove(id);
    } catch (error) {
      return new HttpException(
        error?.message || 'Comment not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
