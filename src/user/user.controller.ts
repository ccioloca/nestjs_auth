import { Controller, Post, Req, UseGuards, Request, Get, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";
import { CurrentUser } from "../decorators/user.decorator";
import { FirebaseAuthGuard } from "../guards/auth.user.guard";
import { ApiTags } from "@nestjs/swagger";

// UserController class responsible for handling user-related endpoints
@Controller("user")
@ApiTags("User") // Attaches metadata tags to the controller for OpenAPI documentation purposes
export class UserController {
  constructor(private readonly usersService: UserService) {} // Constructor to inject the UserService

  // Endpoint to handle POST requests for creating a new user
  @Post()
  createUser(@Body() user): Promise<UserDto> {
    return this.usersService.createUser(user); // Calls the createUser method of the UserService and returns the result
  }

  // Endpoint to handle GET requests for fetching the current authenticated user
  @Get("currentUser")
  @UseGuards(FirebaseAuthGuard) // Applies the FirebaseAuthGuard to restrict access to authenticated users
  getCurrentUser(@CurrentUser() currentUser): Promise<UserDto> {
    return currentUser; // Returns the currently authenticated user
  }

  // Endpoint to handle GET requests for fetching all users
  @Get("all")
  @UseGuards(FirebaseAuthGuard) // Applies the FirebaseAuthGuard to restrict access to authenticated users
  getAllUsers(@CurrentUser() currentUser): Promise<User[]> {
    if (currentUser.roles.includes("admin")) { // Checks if the current user has admin role
      return this.usersService.getAllUsers(); // Calls the getAllUsers method of the UserService and returns the result
    }
    throw new Error("Unauthorized"); // Throws an error if the current user is not authorized
  }
}
