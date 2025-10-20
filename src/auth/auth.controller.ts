// I imported the folder of enums Sex to call it.
// I also modified the @Post('register) code, I added to the code (the columns in the database).

import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Sex } from "../users/enums/enum.sex";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @Post('register')
    async register(@Body() body: { full_name: string; age: number; sex: Sex; username: string; password: string }) {
        return this.usersService.createUser(body.full_name, body.age, body.sex, body.username, body.password);
    }

    @Post('login')
    async login(@Body() body: { username: string, password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) return { error: 'Invalid Credentials' };
        return this.authService.login(user)
    }

    @Post('logout')
    async logout(@Body() body: { userId: number }) {
        return this.authService.logout(body.userId);
    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshTokens(body.refreshToken);
    }
}