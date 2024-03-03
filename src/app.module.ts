import { Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { typeOrmConfigAsync } from "./config/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadFileModule } from "./file/file.module";
import { FileAccessModule } from "./fileAccess/fileAccess.module";
import { FirebaseAuthStrategy } from "./guards/firebase-auth.strategy";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    UploadFileModule,
    FileAccessModule,
    RoleModule
  ],
  controllers: [],
  providers: [FirebaseAuthStrategy],
})

export class AppModule implements NestModule {
  // Configure method is required by the NestModule interface.
  configure() { }
}
