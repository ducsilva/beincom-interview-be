import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, DefaultSchema } from '../../../base/entities/base.schema';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@DefaultSchema()
export class Post extends BaseSchema {
  @Prop({ type: Types.ObjectId, default: new Types.ObjectId(), required: true })
  _id: Types.ObjectId;

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
    type: String,
    required: true,
  })
  category: string;

  @Prop({
    ref: 'User',
    type: Types.ObjectId,
    nullable: false,
  })
  userId: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(require('mongoose-autopopulate'));
