import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileAccess } from '../fileAccess/fileAccess.entity';
import { FileAccessController } from './fileAccess.controller';
import { FileAccessService } from './fileAccess.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileAccess]), UserModule],
  controllers: [FileAccessController],
  providers: [FileAccessService],
  exports: [FileAccessService]
})
export class FileAccessModule {}