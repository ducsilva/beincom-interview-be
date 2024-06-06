import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login.dto';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @ApiOperation({
    summary: 'Register new user',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, email, password, fullname } = createUserDto;
    const existingUserEmail = await this.userService.findByEmail(email);
    const existingUserUsername = await this.userService.findByUsername(
      username,
    );

    if (existingUserEmail) {
      throw new UnauthorizedException(`Email: ${email} already exists`);
    }

    if (existingUserUsername) {
      throw new UnauthorizedException(
        `Username: ${username} already exists! Please use another username`,
      );
    }
    return this.userService.register(username, email, password, fullname);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
