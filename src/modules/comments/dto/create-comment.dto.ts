import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
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
  postId: string;
}
