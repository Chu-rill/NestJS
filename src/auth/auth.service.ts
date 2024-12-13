import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/DB/DB.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { signToken } from "src/utils/jwt.util";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
      });
      const token = await signToken(
        user.id,
        user.name,
        user.email,
        this.config.get("JWT_SECRET"),
        this.jwt
      );
      return {
        statusCode: HttpStatus.OK,
        message: "user signup",
        access_token: token.access_token, // correctly extract access_token
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials Taken");
        }
        throw error;
      }
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException("Credentials incorrect");

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException("Credentials incorrect");

    const token = await signToken(
      user.id,
      user.name,
      user.email,
      this.config.get("JWT_SECRET"),
      this.jwt
    );
    return {
      statusCode: HttpStatus.OK,
      message: "user login",
      access_token: token.access_token, // correctly extract access_token
    };
  }
}
