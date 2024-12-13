import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./DB.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
