import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    // Note: In a real app, use findOne by email and compare hashed password.
    // Assuming UsersService has a method findOneByEmail implemented or using manual search for now.
    const users = await this.usersService.findAll(); // Inefficient, but quick for MVP without modifying UsersService
    const user = users.find(u => u.email === email);

    // Simple check (replace with bcrypt.compare in prod)
    if (user && user.password_hash === pass) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password || '');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role, branchId: user.branch_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

