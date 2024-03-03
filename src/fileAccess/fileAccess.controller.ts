import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { FileAccess } from '../fileAccess/fileAccess.entity';
import { FileAccessService } from './fileAccess.service';

@Controller('file-access')
export class FileAccessController {
  constructor(private readonly fileAccessService: FileAccessService) { }

  // Defines a route handler for GET requests at '/allUsers/:fileId' where :fileId is a route parameter.
  // Retrieves all users who have access to the file identified by fileId.
  // Returns a Promise that resolves to an array of FileAccess objects.
  @Get('allUsers/:fileId')
  getAllUsers(@Param('fileId') fileId: string): Promise<FileAccess[]> {
    return this.fileAccessService.getAllUsers(fileId);
  }

  // Defines a route handler for POST requests at '/addUserToFile/:userId/:fileId' with userId and fileId as route parameters.
  // Adds a user identified by userId to the file identified by fileId.
  // Returns a Promise that resolves to an array of FileAccess objects.
  @Post('addUserToFile/:userId/:fileId')
  addUserToFile(@Param('userId') userId: string, @Param('fileId') fileId: string): Promise<FileAccess[]> {
    return this.fileAccessService.addUserToFile(userId, fileId);
  }

  // Defines a route handler for DELETE requests at '/removeUserFromFile/:userId/:fileId' with userId and fileId as route parameters.
  // Removes the user identified by userId from the file identified by fileId.
  // Returns a Promise that resolves to an array of FileAccess objects.
  @Delete('removeUserFromFile/:userId/:fileId')
  removeUserFromFile(@Param('userId') userId: string, @Param('fileId') fileId: string): Promise<FileAccess[]> {
    return this.fileAccessService.removeUserFromFile(userId, fileId);
  }
}
