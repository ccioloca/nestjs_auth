import { Injectable } from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRole} from "./role.entity";
import {RoleEnum} from "./role.interface";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(UserRole)
        private readonly roleRepository: Repository<UserRole>
    ) {
    }

    // Defines an asynchronous method called createRole which takes an optional parameter of type RoleEnum and returns a Promise of type UserRole.
    async createRole(role?: RoleEnum): Promise<UserRole> {
        try {
            // Creates a new instance of UserRole.
            const roleEntity = new UserRole();

            // Sets the role property of the roleEntity to the provided role or defaults to RoleEnum.USER.
            roleEntity.role = role || RoleEnum.USER;

            // Saves the roleEntity using the roleRepository and returns the result as a Promise.
            return this.roleRepository.save(roleEntity);
        } catch(error) {
            // If an error occurs in the try block, it throws a new Error with the message 'Failed to create role'.
            throw new Error('Failed to create role');
        }
    }

}
