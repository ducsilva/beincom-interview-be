import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryQueryDto {
  @ApiProperty({
    name: 'limit',
    description: 'Limit of this query',
    required: false,
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @ApiProperty({
    name: 'page',
    description: 'Page for this query',
    default: 1,
    required: false,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({
    name: 'name',
    description: 'Name',
    default: '',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;
}
