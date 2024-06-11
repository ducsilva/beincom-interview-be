/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, DefaultSchema } from '../../../base/entities/base.schema';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@DefaultSchema()
export class Category extends BaseSchema {
  @Prop({
    type: String,
    required: true,
  })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(require('mongoose-autopopulate'));
