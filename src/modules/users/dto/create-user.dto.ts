import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    default: 'silva@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: '12345678',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'darkness',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    default: 'darkness',
  })
  fullname: string;
}
