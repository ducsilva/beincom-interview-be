import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AllExceptionsFilter } from 'exception';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get profile',
  })
  async getProfile(@Req() req: any) {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findByEmail(decodedToken.email);
      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }

      return user;
    } catch (error) {
      throw new AllExceptionsFilter();
    }
  }
}
