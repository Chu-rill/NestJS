import { JwtService } from "@nestjs/jwt";

export async function signToken(
  userId: number,
  name: string,
  email: string,
  secret: string,
  jwtService: JwtService
): Promise<{ access_token: string }> {
  const payload = { sub: userId, name, email };

  const token = await jwtService.signAsync(payload, {
    expiresIn: "15m",
    secret: secret,
  });

  return { access_token: token };
}
