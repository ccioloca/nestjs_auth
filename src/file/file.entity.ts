import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    Entity,
} from "typeorm";
import {BaseEntity} from "../common/base.entity";
import { FilePermission } from "./file.dto";


@Entity({ name: "file" })
export class File extends BaseEntity {
    @ApiProperty()
    @Column({ nullable: true, name: 'file_type'  })
    fileMimeType: string;

    @ApiProperty()
    @Column({ nullable: true, name: 'file_size' })
    fileSize: number;

    @ApiProperty()
    @Column({ unique: true, name: 'file_name' })
    fileName: string;

    @ApiProperty()
    @Column({ unique: true, name: 'file_path'})
    path: string;

    @ApiProperty()
    @Column({ nullable: false,  name: 'valid_until'  })
    validUntil: Date;

    @ApiProperty()
    @Column({ nullable: true,  name: 'published_by'  })
    publishedBy: string;

    @ApiProperty()
    @Column({ nullable: true,  name: 'file_permission', default: FilePermission.PRIVATE })
    permission: FilePermission;
}
