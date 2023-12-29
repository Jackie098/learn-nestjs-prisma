import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async createToken() {
    return;
  }

  async checkToken(token: string) {
    return;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`E-mail e/ou senha incorretos.`);
    }

    return user;
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`E-mail está incorreto.`);
    }

    // TODO: Send email to recover account here

    return true;
  }
  async reset(password: string, token: string) {
    // TODO: If token is valid

    const id = 10;

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return true;
  }
}
