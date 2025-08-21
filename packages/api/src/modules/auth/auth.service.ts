import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

interface GoogleUserData {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && user.password && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async validateOrCreateGoogleUser(googleUser: GoogleUserData): Promise<any> {
    // First try to find user by Google ID
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (user) {
      // Update user info if found by Google ID
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          picture: googleUser.picture,
        },
      });
      const { password: _, ...result } = user;
      return result;
    }

    // Try to find user by email
    user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      // Link Google account to existing user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.googleId,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          picture: googleUser.picture,
        },
      });
      const { password: _, ...result } = user;
      return result;
    }

    // Create new user
    user = await this.prisma.user.create({
      data: {
        email: googleUser.email,
        googleId: googleUser.googleId,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        locale: 'en', // Default locale for Google users
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        locale: registerDto.locale || 'en',
      },
    });

    const tokens = await this.generateTokens(user);
    
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        locale: user.locale,
        roles: user.roles,
      },
    };
  }

  async login(user: any): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(user);
    
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        locale: user.locale,
        roles: user.roles,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret-key'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET', 'your-secret-key'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'your-refresh-secret-key'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async generateAccessToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'your-secret-key'),
      expiresIn: '15m',
    });
  }
}