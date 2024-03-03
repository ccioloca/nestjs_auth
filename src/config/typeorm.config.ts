import { ConfigService } from "@nestjs/config";
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions
} from "@nestjs/typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import {User} from "../user/user.entity";
import { File } from "../file/file.entity";
import { FileAccess } from "../fileAccess/fileAccess.entity";
import { UserRole } from "../role/role.entity";

export const entities = [
    User,
    File,
    FileAccess,
    UserRole
];

export const migrations = [

];

export default class TypeOrmConfig {
    static getOrmConfig(
        configService: ConfigService
    ): TypeOrmModuleOptions {
        const config: PostgresConnectionOptions = {
            type: "postgres",
            host: configService.get("DB_HOST", "localhost"),
            port: configService.get<number>("DB_PORT", 5432),
            username: configService.get("DB_USERNAME"),
            password: configService.get("DB_PASSWORD"),
            database: configService.get("DB_NAME"),
            // !!! DO NOT CHANGE synchronize flag !!!
            synchronize: true,
            logging: false,
            entities: entities,
            migrations: migrations,
            migrationsRun: true,
            logger: "advanced-console"
        };

        return {
            ...config,
            autoLoadEntities: true
        };
    }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
    inject: [ConfigService]
};
