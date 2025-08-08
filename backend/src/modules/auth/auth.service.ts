import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from '../../entities/user.entity';
import { Admin } from '../../entities/admin.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const admin = await this.adminRepository.findOne({ where: { email: user.email } });
    const role = admin ? UserRole.ADMIN : UserRole.VIEWER;
    const payload = { email: user.email, sub: user.id, role };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.VIEWER, // Default role
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;

    return result;
  }

  async createAdminUser() {
    const adminEmail = 'admin@example.com';

    let user = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = this.userRepository.create({
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: UserRole.VIEWER,
      });
      await this.userRepository.save(user);
    }

    const adminExists = await this.adminRepository.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      const adminEntry = this.adminRepository.create({ email: adminEmail });
      await this.adminRepository.save(adminEntry);
    }

    console.log('Admin user available: admin@example.com / admin123');
  }
}
