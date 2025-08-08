import { Controller, Post, Body, UseGuards, Request, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { FirebaseService } from './firebase.service';

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
  constructor(private authService: AuthService, private firebase: FirebaseService) {}

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { user, token };
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

  // Google OAuth
  // Enable Google OAuth endpoints only when configured
  @Get('google')
  @ApiOperation({ summary: 'Google OAuth: redirect to Google' })
  async googleAuth(@Res() res: Response) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(404).send('Google OAuth not configured');
    }
    return res.redirect('/api/auth/google/start');
  }

  @Get('google/start')
  @UseGuards(AuthGuard('google'))
  async googleAuthStart() {
    return;
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req, @Res() res: Response) {
    const { token } = await this.authService.loginOrRegisterGoogle(req.user);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:4200/admin';
    return res.redirect(redirectUrl);
  }

  @Post('firebase-login')
  @ApiOperation({ summary: 'Login via Firebase ID token' })
  @ApiBody({ schema: { properties: { idToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async firebaseLogin(@Body('idToken') idToken: string, @Res({ passthrough: true }) res: Response) {
    const decoded: any = await this.firebase.verifyIdToken(idToken);
    const { email = '', name = '' } = decoded;
    const [firstName = '', lastName = ''] = (name || '').split(' ');
    const { token, user } = await this.authService.loginOrRegisterGoogle({
      email,
      firstName,
      lastName,
    });
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { user, token };
  }
}
