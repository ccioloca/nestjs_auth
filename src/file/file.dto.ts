import { IsInt, IsString, Min } from 'class-validator';

export class FileDto {
    @IsString()
    fieldname: string;
    @IsString()
    originalname: string;
    @IsString()
    encoding: string;
    @IsString()
    mimetype: string;
    @IsString()
    destination: string;
    @IsString()
    filename: string;
    @IsString()
    path: string;
    @IsInt()
    size: number;
}

export class PaginationDto {
    @IsInt()
    @Min(1)
    page: number;

    @IsInt()
    @Min(1)
    pageSize: number;
}

export enum FilePermission {
    PRIVATE = "PRIVATE",
    SHARED = "SHARED",
    PUBLIC = "PUBLIC",
}
