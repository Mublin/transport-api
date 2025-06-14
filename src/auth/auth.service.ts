import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser({
    email,
    inputPassword,
  }: {
    email: string;
    inputPassword: string;
  }) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid creds');
    }
    let verify = await bcrypt.compare(inputPassword, user.password);
    if (!verify) {
      throw new NotFoundException('Invalid creds');
    }
    return {
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      role: user.role,
    };
  }

  async create(createAuthDto: CreateAuthDto) {
    const { password, ...creds } = createAuthDto;
    const hashed = await bcrypt.hash(password, 12);
    const user: any = await this.userService.create({
      password: hashed,
      ...creds,
    });
    const refreshToken = await this.updateRefreshToken(user._id, {
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      role: user.role,
    });
    return {
      accessToken: this.jwtService.sign({
        sub: user._id,
        role: user.role,
        email: user.email,
      }),
      refreshToken: refreshToken,
      email: user.email,
      role: user.role,
    };
  }

  async login({
    identifier,
    inputPassword,
  }: {
    identifier: string;
    inputPassword: string;
  }) {
    try {
      const user: any = await this.validateUser({
        email: identifier,
        inputPassword,
      });
      if (!user) {
        throw new Error('error 3');
      }
      const refreshToken = await this.updateRefreshToken(user._id, {
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        role: user.role,
      });
      return {
        accessToken: this.jwtService.sign({
          sub: user._id,
          role: user.role,
          email: user.email,
        }),
        refreshToken: refreshToken,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }



  async updateRefreshToken(
    id: string,
    user: {
      _id: string;
      email: string;
      phoneNumber: string;
      firstName: string;
      role: Role;
    },
  ) {
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        role: user.role,
      },
      {
        secret: this.configService.get('JWT_REFRESH'),
        expiresIn: '2d',
      },
    );
    await this.userService.updateRefreshToken(id, refreshToken);
    return refreshToken;
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
