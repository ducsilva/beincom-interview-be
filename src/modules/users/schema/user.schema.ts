import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, DefaultSchema } from '../../../base';
import { Role } from '../../../config/role';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@DefaultSchema()
export class User extends BaseSchema {
  @Prop({ type: Types.ObjectId, default: new Types.ObjectId(), required: true })
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    required: false,
    default: Role.USER,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(require('mongoose-autopopulate'));
