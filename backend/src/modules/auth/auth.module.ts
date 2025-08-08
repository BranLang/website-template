import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { User } from '../../entities/user.entity';
import { Admin } from '../../entities/admin.entity';
import { FirebaseService } from './firebase.service';

const authProviders = [AuthService, JwtStrategy, LocalStrategy] as any[];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  authProviders.push(GoogleStrategy);
}

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [...authProviders, FirebaseService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
