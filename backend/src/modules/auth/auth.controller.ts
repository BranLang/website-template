import { Controller, Post, Body, UseGuards, Request, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

const loginBodyExample = {
  email: 'admin@example.com',
  password: 'admin123',
};

const loginResponseExample = {
  access_token: 'jwt.token.here',
  user: {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
};

const registerBodyExample = {
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'New',
  lastName: 'User',
};

const registerResponseExample = {
  id: 2,
  email: 'newuser@example.com',
  firstName: 'New',
  lastName: 'User',
  role: 'viewer',
  isActive: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const profileResponseExample = {
  id: 1,
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        summary: 'Login credentials',
        value: loginBodyExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { example: loginResponseExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req, @Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(req.user);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        summary: 'Registration data',
        value: registerBodyExample,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: { example: registerResponseExample },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile data',
    schema: { example: profileResponseExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }
}
