import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Response,
  Res,
  UseGuards,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import {
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'; // Import OpenAPI decorators
import { FileDto, PaginationDto } from './file.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { FileService } from './file.service';
import { FirebaseAuthGuard } from '../guards/auth.user.guard';
import { File } from './file.entity';
import { storage } from './utils/multer';

@Controller('file')
@UseGuards(FirebaseAuthGuard)
@ApiTags('File') // Assigns a tag to the controller for OpenAPI documentation
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(@UploadedFile() file: any, @CurrentUser() currentUser): Promise<File[]> {
    return this.fileService.uploadFile(file, currentUser.id);
  }

  @Get('download/:fileId')
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  async download(@Param('fileId') fileId: string, @Res() res: Response): Promise<any> {
    const file = await this.fileService.download(fileId);
    file.pipe(res);
  }

  @Get('private')
  @ApiResponse({ status: 200, description: 'Retrieved files uploaded by the current user' })
  async getPrivateFiles(@CurrentUser() currentUser): Promise<File[]> {
    return this.fileService.getPrivateFiles(currentUser.id);
  }

  @Get('shared')
  @ApiResponse({ status: 200, description: 'Retrieved files accessible by the current user' })
  async getSharedFiles(@CurrentUser() currentUser): Promise<File[]> {
    return this.fileService.getSharedFiles(currentUser.id);
  }

  @Get('public')
  @ApiResponse({ status: 200, description: 'Retrieved all public files' })
  async getPublicFiles(): Promise<File[]> {
    return this.fileService.getPublicFiles();
  }

  @Put('rename/:fileId')
  @ApiResponse({ status: 200, description: 'File renamed successfully' })
  async renameFile(@Body() body, @Param('fileId') fileId: string, @CurrentUser() currentUser): Promise<File> {
    return this.fileService.renameFile(fileId, body.newName, currentUser.id);
  }

  @Get('paginated/all')
  @ApiResponse({ status: 200, description: 'Retrieved paginated files' })
  async findAll(@Query() paginationDto: PaginationDto, @CurrentUser() currentUser): Promise<File[]> {
    if (!currentUser.roles.includes('admin')) {
      throw new Error('You are not authorized to perform this action');
    }

    const { page = 1, pageSize = 50 } = paginationDto;
    return this.fileService.getPaginatedFiles(page, pageSize);
  }
}