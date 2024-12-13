import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./DB/DB.module";
import { ConfigModule } from "@nestjs/config";
import { NoteModule } from "./note/note.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    NoteModule,
  ],
})
export class AppModule {}
