import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { ClaimsService } from './claims.service';
import { AuthController } from './auth.controller';
import { ProfileController } from './profile.controller';
import { ClaimsController } from './claims.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [AuthController, ProfileController, ClaimsController],
  providers: [AuthService, ClaimsService, JwtStrategy, LocalStrategy, GoogleStrategy],
  exports: [AuthService, ClaimsService],
})
export class AuthModule {}