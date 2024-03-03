import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    Entity,
    OneToMany,
} from "typeorm";
import {BaseEntity} from "../common/base.entity";
import { UserRole } from "../role/role.entity";

@Entity({ name: "user" })
export class User extends  BaseEntity {
    @ApiProperty()
    @Column({ nullable: true, name: 'first_name'  })
    firstName: string;

    @ApiProperty()
    @Column({ nullable: true, name: 'last_name' })
    lastName: string;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Column({ unique: true })
    externalUserId: string;

    @OneToMany(() => UserRole, role => role.user)
    roles: UserRole[];
}
