import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './entities/comment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}
  create({ content, postId }: CreateCommentDto, userId: string) {
    const newComment = new this.commentModel({ content, postId, userId });
    return newComment.save();
  }

  async findAllByPostId(postId: string) {
    const comment = await this.commentModel.find({ postId }).exec();
    return comment;
  }

  async findOne(id: string) {
    const commentDetail = await this.commentModel.findById(id).exec();
    if (!commentDetail) {
      throw new HttpException(
        `Cannot find comment with ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return commentDetail;
  }
  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, { $set: updateCommentDto }, { new: true })
      .exec();

    if (!updatedComment) {
      throw new HttpException(
        `Cannot find comment with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return updatedComment;
  }

  async remove(id: string) {
    const deletedComment = await this.commentModel.findByIdAndRemove(id).exec();
    if (!deletedComment) {
      throw new HttpException(
        `Cannot find comment with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return deletedComment;
  }
}
