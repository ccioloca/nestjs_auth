import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { UserModule } from '../user/user.module';
import { FileAccessModule } from '../fileAccess/fileAccess.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    UserModule,
    FileAccessModule
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class UploadFileModule { }