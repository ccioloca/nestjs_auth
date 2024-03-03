import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    Entity,
} from "typeorm";
import {BaseEntity} from "../common/base.entity";

@Entity({ name: "file_access" })
export class FileAccess extends BaseEntity {
    @ApiProperty()
    @Column({ nullable: true, name: 'user_id'  })
    userId: string;

    @ApiProperty()
    @Column({ nullable: true, name: 'file_id' })
    fileId: string;
}
