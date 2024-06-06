import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login.dto';
import { CloudinaryMulterConfigService } from 'middleware/cloudinary.middleware.service';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private readonly cloudaryService: CloudinaryMulterConfigService,
  ) {}

  @ApiOperation({
    summary: 'Register new user',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    return this.userService.register(username, email, password);
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
