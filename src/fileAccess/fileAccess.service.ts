import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileAccess } from '../fileAccess/fileAccess.entity';
import { isOwner } from '../helpers/ownership';

@Injectable()
export class FileAccessService {
  constructor(
    @InjectRepository(FileAccess)
    private readonly fileAccessRepository: Repository<FileAccess>,
  ) { }


  /**
   * Asynchronous function to add a user to a file access list
   * @param userId - The ID of the user to be added
   * @param fileId - The ID of the file for which access is being granted
   * @returns A promise that resolves with an array of FileAccess objects
   */
  async addUserToFile(userId, fileId): Promise<FileAccess[]> {
    // Find the file access entity for the specified user and file
    const entity = await this.fileAccessRepository.findOne({
      where: {
        userId,
        fileId
      }
    });

    // Check if the user is the owner of the file
    if (!isOwner(userId, entity.userId)) {
      throw new Error('User is not allowed to add other users to file');
    }

    // If the entity already exists, throw an error (user already has access to file)
    if (entity) {
      throw new Error('User already has access to file');
    }

    try {
      // Create a new FileAccess object and assign user and file IDs
      const fileAccess = new FileAccess();
      fileAccess.userId = userId;
      fileAccess.fileId = fileId;
      // Save the new file access entity
      await this.fileAccessRepository.save(fileAccess);
      // Return the list of file accesses for the specified file
      return this.fileAccessRepository.find({ where: { fileId } })
    } catch (error) {
      throw new Error('Failed to add user to file');
    }
  }

/**
 * Asynchronous function to retrieve files accessible by a specific user
 * @param userId - The ID of the user for whom accessible files need to be retrieved
 * @returns A promise that resolves with an array of FileAccess objects
 */
async getFilesForUser(userId): Promise<FileAccess[]> {
  // Find files associated with the specified user ID
  const files = await this.fileAccessRepository.find({
    where: {
      userId
    }
  });

  // If no files are found for the user, throw an error
  if (!files) {
    throw new Error('No files found for user');
  }

  // Return the array of files accessible by the user
  return files;
}


  /**
   * Asynchronous function to get specific file access for a user
   * @param userId - The ID of the user
   * @param fileId - The ID of the file
   * @returns A promise that resolves with a single FileAccess object or undefined
   */
  async getSpecificFileForUser(userId, fileId): Promise<FileAccess> {
    // Find and return the file access entity for the specified user and file
    return this.fileAccessRepository.findOne({
      where: {
        userId,
        fileId
      }
    });
  }

  /**
   * Asynchronous function to remove a user's access to a file
   * @param userId - The ID of the user whose access needs to be removed
   * @param fileId - The ID of the file from which access is to be removed
   * @returns A promise that resolves with an array of FileAccess objects
   * @throws Error if the user is not allowed to remove other users or does not have access to the file
   */
  async removeUserFromFile(userId, fileId): Promise<FileAccess[]> {
    // Find the file access entity for the specified user and file
    const entity = await this.fileAccessRepository.findOne({
      where: {
        userId,
        fileId
      }
    });

    // Check if the user is authorized to remove other users from the file
    if (!isOwner(userId, entity.userId)) {
      throw new Error('User is not allowed to remove other users from file');
    }

    // Throw error if the file access entity does not exist (user does not have access to the file)
    if (!entity) {
      throw new Error('User does not have access to file');
    }

    try {
      // Remove the file access entry for the user and file from the repository
      await this.fileAccessRepository
        .createQueryBuilder("fileAccess")
        .delete()
        .where("id= :id", { id: entity.id })
        .execute();

      // Return the updated list of FileAccess objects for the file
      return this.fileAccessRepository.find({ where: { fileId } });
    } catch (error) {
      // Throw error if an exception occurs during the removal process
      throw new Error('Failed to remove user from file');
    }
  }


  /**
   * Asynchronous function to retrieve all users with access to a specific file
   * @param fileId - The ID of the file for which users' access needs to be retrieved
   * @returns A promise that resolves with an array of FileAccess objects
   */
  async getAllUsers(fileId): Promise<FileAccess[]> {
    // Find and return all FileAccess entities associated with the specified file ID
    return this.fileAccessRepository.find({
      where: {
        fileId
      }
    });
  }
}