import { applyDecorators } from '@nestjs/common';
import { Prop, Schema } from '@nestjs/mongoose';

export const DefaultSchema = () => {
  return applyDecorators(
    Schema({
      timestamps: true,
      toJSON: {
        getters: true,
      },
      toObject: {
        getters: true,
      },
    }),
  );
};

export class BaseSchema {
  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    required: false,
    default: () => new Date().toISOString(),
  })
  updatedAt: string;

  @Prop({
    required: false,
    default: () => new Date().toISOString(),
  })
  createdAt: string;
}
