import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { File } from 'multer';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: '',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: '',
  })
  content: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: '',
  })
  categoryId: string;

  @ApiProperty({
    name: 'banner',
    description: 'Select an banner',
    required: true,
    type: String,
    format: 'binary',
  })
  banner: File;

  // @ApiProperty({
  //   description: 'Attachments',
  //   type: 'array',
  //   items: {
  //     type: 'file',
  //     items: {
  //       type: 'string',
  //       format: 'binary',
  //     },
  //   },
  // })
  // sliders: Express.Multer.File[];
}
