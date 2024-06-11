import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, DefaultSchema } from '../../../base/entities/base.schema';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@DefaultSchema()
export class Comment extends BaseSchema {
  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  userId: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(require('mongoose-autopopulate'));
