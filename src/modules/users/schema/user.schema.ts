import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, DefaultSchema } from '../../../base';
import { Role } from '../../../config/role';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@DefaultSchema()
export class User extends BaseSchema {
  [x: string]: any;
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

  @Prop({
    type: String,
    required: false,
  })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(require('mongoose-autopopulate'));
