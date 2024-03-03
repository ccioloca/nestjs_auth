// This import statement imports necessary decorators and classes from the "typeorm" library.

import {
    CreateDateColumn,  // Decorator for automatically setting the create date column in the database.
    Entity,             // Decorator to declare a new entity class.
    PrimaryGeneratedColumn, // Decorator for automatically generating primary key column with auto-increment value or UUID.
    UpdateDateColumn     // Decorator for automatically setting the update date column in the database.
} from "typeorm";

@Entity()  // Marks the class as an entity that will be managed by TypeORM.
export class BaseEntity {  // Defines a new class called BaseEntity.
    @PrimaryGeneratedColumn("uuid")  // Decorates the id property to make it a primary key and generate UUID values.
    id: string;  // Declares the id property of type string.

    @CreateDateColumn({ type: "timestamp" })  // Decorates the createdAt property to automatically set the creation date when a new record is inserted.
    public createdAt?: Date;  // Declares the createdAt property of type Date, which is optional.

    @UpdateDateColumn({ type: "timestamp" })  // Decorates the updatedAt property to automatically set the update date when a record is updated.
    public updatedAt?: Date;  // Declares the updatedAt property of type Date, which is optional.
}
