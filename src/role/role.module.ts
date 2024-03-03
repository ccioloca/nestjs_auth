import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleService} from "./role.service";
import {UserRole} from "./role.entity";

@Module({
    imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([UserRole])],
    controllers: [],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule {}
