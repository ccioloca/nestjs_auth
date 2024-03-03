import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    Entity,
    ManyToOne,
} from "typeorm";
import {BaseEntity} from "../common/base.entity";
import {RoleEnum} from "./role.interface";
import { User } from "../user/user.entity";

@Entity({ name: "user_roles" })
export class UserRole extends  BaseEntity {
    // Decorator used to define a property as an OpenAPI schema item.
    @ApiProperty()
    
    // Decorator used to specify the column details for the database table. It defines the role property with the options of not allowing null values and setting a default value of RoleEnum.USER.
    @Column({ nullable: false, default: RoleEnum.USER })
    role: string;

    // Decorator used to define a many-to-one relationship between UserRole entity and User entity. It specifies that each UserRole belongs to one User, and each User can have multiple UserRole instances.
    @ManyToOne(() => User, user => user.roles)
    user: User;

}
