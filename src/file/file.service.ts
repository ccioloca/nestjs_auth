import { Injectable } from '@nestjs/common';
import { FileDto, FilePermission } from './file.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { createReadStream } from 'fs';
import { FileAccessService } from '../fileAccess/fileAccess.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) // Injects the repository for the "File" entity
    private readonly fileRepository: Repository<File>, // Instance of the "File" repository
    private readonly fileAccessService: FileAccessService,
  ) { }

  /**
   * Uploads a file to the system.
   * @param metadata - Metadata of the file to be uploaded
   * @returns Promise that resolves to the uploaded File entity
   */
  async uploadFile(metadata: FileDto, publisherId: string): Promise<File[]> {
    const file = new File(); // Create a new File entity

    const date = new Date(); // Now
    date.setDate(date.getDate() + 30);

    file.fileName = metadata.filename; // Set the file name
    file.fileSize = metadata.size; // Set the file size
    file.fileMimeType = metadata.mimetype; // Set the file MIME type
    file.path = metadata.path; // Set the file path
    file.publishedBy = publisherId; // Set the file publisher ID
    file.validUntil = date; // Set the file validity period
    file.permission = FilePermission.PRIVATE; // Set the file permission
    
    try {
      await this.fileRepository.save(file); // Save the file entity in the repository and return it
      return this.fileRepository.find({ where: { publishedBy: publisherId } })
    } catch (error) {
      throw new Error('Failed to upload file'); // Throw an error if file upload fails
    }
  }

  /**
   * Downloads a file with the given fileId.
   * @param fileId - ID of the file to be downloaded
   * @returns Promise that resolves to a readable stream of the file
   */
  async download(fileId: string): Promise<any> {
    const file = await this.fileRepository.findOne({ // Find the file entity by ID
      where: {
        id: fileId
      }
    });

    if (!file) {
      throw new Error('File not found'); // Throw an error if file is not found
    }

    return createReadStream(file.path); // Return a readable stream of the file
  }

  /**
   * Retrieves all files from the system.
   * @returns Promise that resolves to an array of File entities
   */
  async getPublicFiles(): Promise<File[]> {
    return this.fileRepository.find({
      where: {
        permission: FilePermission.PUBLIC
      }
    }); // Retrieve all public files from the repository
  }

  /**
   * Retrieves the files uploaded by a specific user.
   * @param userId - The ID of the user who uploaded the files
   * @returns Promise that resolves to an array of File entities
   */
  async getPrivateFiles(userId: string): Promise<File[]> {
    return this.fileRepository.find({ where: { publishedBy: userId } });
  }

  /**
   * Retrieves the files that a user has access to.
   * @param userId - The ID of the user for whom to retrieve the accessible files
   * @returns Promise that resolves to an array of File entities
   */
  async getSharedFiles(userId: string): Promise<File[]> {
    const fileAccess = await this.fileAccessService.getFilesForUser("fa48e1cb-d2ee-4504-a199-4bdd8dc1e66b"); // Retrieve file access for the user
    const fileIds = fileAccess.map((file) => file.fileId); // Extract the file IDs from the file access
    return this.fileRepository.find({ where: { id: In(fileIds) } }); // Retrieve files based on the extracted file IDs
  }


  /**
   * Retrieves a file by its ID.
   * @param fileId - ID of the file to retrieve
   * @returns Promise that resolves to the File entity
   */
  async getFileById(fileId: string, userId: string): Promise<File> {
    // Retrieve the file entity using the fileId
    const fileEntity = await this.getFile(fileId);

    // Throw an error if the file entity is not found
    if (!fileEntity) {
      throw new Error('File not found');
    }

    // Destructure permission and publishedBy from the file entity
    const { permission, publishedBy } = fileEntity;

    // Check if the file is private and published by the user
    if (permission === FilePermission.PRIVATE && publishedBy === userId) {
      return fileEntity; // Return the file entity if it meets the condition
    }

    // Check if the file permission is limited
    if (permission === FilePermission.SHARED) {
      // Find the file access entity for the specified fileId and userId
      const fileAccess = await this.fileAccessService.getSpecificFileForUser(userId, fileId);

      // If file access is found, return the file entity
      if (fileAccess) {
        return fileEntity;
      } else {
        throw new Error('Access denied'); // Throw an error if file access is not found
      }
    }

    // Check if the file permission is public
    if (permission === FilePermission.PUBLIC) {
      return fileEntity; // Return the file entity if it is public
    }

    // If none of the above conditions are met, throw an error indicating access denied
    throw new Error('Access denied');
  }

  /**
   * Renames a file with the given fileId to the specified newName.
   * @param fileId - ID of the file to rename
   * @param newName - New name for the file
   * @returns Promise that resolves to the updated File entity
   */
  async renameFile(fileId: string, newName: string, userId: string): Promise<File> {
    const file = await this.getFile(fileId); // Retrieve the file entity by ID

    if (file.publishedBy !== userId) {
      throw new Error('Access denied'); // Throw an error if the user is not the publisher
    }

    try {
      file.fileName = newName; // Update the file name
      const response = await  this.fileRepository.save(file); // Save the updated file entity and return it
      return response
    } catch (error) {
      throw new Error('Failed to rename file'); // Throw an error if file rename fails
    }
  }

  /**
   * Retrieves a paginated list of files from the system.
   * @param page - The page number for pagination
   * @param pageSize - The number of files per page
   * @returns Promise that resolves to an array of File entities
   */
  async getPaginatedFiles(page: number, pageSize: number): Promise<File[]> {
    const files = await this.fileRepository.find({ skip: (page - 1) * pageSize, take: pageSize });

    if (!files) {
      return []; // Throw an error if no files are found
    }

    return files; // Return the paginated list of files
  }

  /**
   * Retrieves a file entity by its ID.
   * @param fileId - The ID of the file to retrieve
   * @returns Promise that resolves to the File entity
   * @throws Error if the file is not found
   */
  private async getFile(fileId: string): Promise<File> {
    const fileEntity = await this.fileRepository.findOne({ // Find the file entity by ID
      where: {
        id: fileId
      }
    });

    if (!fileEntity) {
      throw new Error('File not found'); // Throw an error if file is not found
    }

    return fileEntity;
  }

  async updateFilePermission(fileId: string, permission: FilePermission, userId: string): Promise<File> {
    const file = await this.getFile(fileId); // Retrieve the file entity by ID

    if (file.publishedBy !== userId) {
      throw new Error('Access denied'); // Throw an error if the user is not the publisher
    }

    try {
      file.permission = permission; // Update the file permission
      const response = await this.fileRepository.save(file); // Save the updated file entity and return it
      return response;
    } catch (error) {
      throw new Error('Failed to update file permission'); // Throw an error if file permission update fails
    }
  }
}
