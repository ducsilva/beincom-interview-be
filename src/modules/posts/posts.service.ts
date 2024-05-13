import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './entities/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PostQueryDto } from 'base/query';
import { getPropertiesIfExists, paginate } from 'utils';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
  ) {}
  create(input: CreatePostDto, userId: string) {
    const newPost = new this.postModel({ ...input, userId });
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
      .limit(limit);

    const totalItems = await this.postModel.countDocuments(condition);

    return paginate({
      data: appService,
      totalItems,
      page: page,
      limit: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
