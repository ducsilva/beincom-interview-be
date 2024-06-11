import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './entities/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostQueryDto } from 'base/query';
import { getPropertiesIfExists, paginate } from '../../utils';
import { CommentsService } from 'modules/comments/comments.service';
import { SearchQueryDto } from 'base/query/search.query';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    private readonly commentsService: CommentsService,
  ) {}
  create(input: CreatePostDto, user: string) {
    const newPost = new this.postModel({ ...input, user });
    return newPost.save();
  }

  async findAll(query: PostQueryDto) {
    const { limit, page, ...rest } = query;
    const skip = (page - 1) * limit || 0;
    const filterParams = getPropertiesIfExists(rest);
    const condition = {
      isDeleted: false,
      ...filterParams,
    };

    const appService = await this.postModel
      .find(condition)
      .skip(skip)
      .limit(limit)
      .populate({ path: 'user', select: '-password' })
      .populate('category')
      .sort({ createdAt: -1 })
      .exec();

    const totalItems = await this.postModel.countDocuments(condition);

    const postsWithComments = await Promise.all(
      appService.map(async (post) => {
        const comments = await this.commentsService.findAllByPostId(post.id);
        return {
          ...post.toJSON(),
          comments,
        };
      }),
    );

    return paginate({
      data: postsWithComments,
      totalItems,
      page: page,
      limit: limit,
    });
  }

  async findOne(id: string) {
    const postDetail = await this.postModel
      .findById(id)
      .populate({ path: 'user', select: '-password' })
      .populate('category')
      .exec();
    if (!postDetail) {
      throw new HttpException(
        `Cannot find post with ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return postDetail;
  }

  async searchPosts(searchQuery: SearchQueryDto) {
    const { query } = searchQuery;
    const result = await this.postModel
      .aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: new RegExp(query, 'i') } },
              { content: { $regex: new RegExp(query, 'i') } },
            ],
          },
        },
      ])
      .exec();

    const postsWithComments = await Promise.all(
      result?.map(async (post) => {
        const comments = await this.commentsService.findAllByPostId(
          post._id.toString(),
        );
        return {
          ...post,
          comments,
        };
      }),
    );
    return postsWithComments;
  }
}
