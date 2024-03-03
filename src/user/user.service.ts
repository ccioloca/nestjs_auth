import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, UserDto } from "./user.dto";
import { RoleService } from "../role/role.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService
  ) {
  }

  async getUser(email: string): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email
        },
        relations: ['roles']
      });
      return user;
    } catch (error) {
      throw new Error('Failed to get user');
    }
  }

  async createUser(user: CreateUserDto): Promise<UserDto> {
    try {
      const userEntity = new User();
      userEntity.firstName = user.firstName;
      userEntity.lastName = user.lastName;
      userEntity.email = user.email;
      userEntity.externalUserId = user.externalUserId;
      const role = await this.roleService.createRole(user.role);
      userEntity.roles = [role];
      const savedUser = await this.userRepository.save(userEntity);
      return this.getUser(savedUser.email);
    } catch (error) {
      console.log('Error', error);
      throw new Error('Failed to create user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles']
    });
  }
}
