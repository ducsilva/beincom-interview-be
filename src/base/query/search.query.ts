import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    name: 'query',
    description: 'Search content and title',
    default: '',
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class QueryUsername {
  @ApiProperty({
    name: 'username',
    description: 'View user by username',
    default: '',
    required: false,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
