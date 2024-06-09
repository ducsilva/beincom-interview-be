import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, DefaultSchema } from '../../../base/entities/base.schema';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@DefaultSchema()
export class Post extends BaseSchema {
  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: String,
    required: true,
  })
  banner: string;

  @Prop({
    ref: 'Category',
    type: Types.ObjectId,
    nullable: true,
  })
  category: Types.ObjectId;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
    nullable: false,
    autopopulate: true,
  })
  user: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Comment', autopopulate: true }])
  comments: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(require('mongoose-autopopulate'));
