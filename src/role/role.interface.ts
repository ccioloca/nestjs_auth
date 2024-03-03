export enum RoleEnum {
    USER='user',
    ADMIN='admin',
}

export class IRole {
    userId: string;
    role: RoleEnum;
}