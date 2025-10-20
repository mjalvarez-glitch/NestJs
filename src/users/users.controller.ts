// I imported the folder of enums Sex to call it.
// I modified the part where it creates user, I added the part where I added the full_name, age, and sex.

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from "@nestjs/common";
import { UsersService } from './users.service';
import { JwtAuthguard } from "../auth/jwt-auth.guard";
import { Sex } from "./enums/enum.sex";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // Get all users (protected)
    @UseGuards(JwtAuthguard)
    @Get()
    async getAll() {
        return this.usersService.getAll();
    }

    // Get a single user by id (protected)
    @UseGuards(JwtAuthguard)
    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.usersService.findById(+id);
    }

    // Create user (open - for demo)
    @Post()
    async create(@Body() body: { full_name: string, age: number, sex: Sex, username: string, password: string}) {
        return this.usersService.createUser(body.full_name, body.age, body.sex, body.username, body.password);
    }

    // Update user (protected)
    @UseGuards(JwtAuthguard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.usersService.updateUser(+id, body);
    }

    // Delete user (protected)
    @UseGuards(JwtAuthguard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.deleteUser(+id)
    }
}