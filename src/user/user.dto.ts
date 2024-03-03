import { RoleEnum } from "../role/role.interface";
import { UserRole } from "../role/role.entity";

class UserDtoBase {
    firstName: string;
    lastName: string;
    email: string;
}

export class CreateUserDto extends UserDtoBase {
    role: RoleEnum;
    externalUserId: string;
}

export class UserDto extends UserDtoBase {
    roles: UserRole[];  
}