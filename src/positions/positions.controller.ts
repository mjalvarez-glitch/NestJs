// Import the Request type from 'express' to help represent the request from the client
// The asnyc Create is also linked with the user on request
// The other "users" content has been also modified

import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from "@nestjs/common";
import { PositionsService } from './positions.service';
import { JwtAuthguard } from "../auth/jwt-auth.guard";
import { Request as ExpressRequest } from 'express'; 


@Controller('positions')
export class PositionsController {
    constructor(private positionsService: PositionsService) {}

    // Get all positions (protected)
    @UseGuards(JwtAuthguard)
    @Get()
    async getAll() {
        return this.positionsService.getAll();
    }

    // Get a single position by position_id (protected)
    @UseGuards(JwtAuthguard)
    @Get(':position_id')
    async getOne(@Param('position_id') positionId: string) {
        return this.positionsService.findById(+positionId);
    }

    @UseGuards(JwtAuthguard)
    @Post()
    async create(@Body() body: { position_code: string, position_name: string }, 
        @Request() req: ExpressRequest & { user: { id: number; username: string; role: string; } }
    ) {

        const user_id = req.user.id; 

        return this.positionsService.createPosition(body.position_code, body.position_name, user_id);
    }

    // Update position (protected)
    @UseGuards(JwtAuthguard)
    @Put(':position_id')
    async update(@Param('position_id') positionId: string, @Body() body: { position_code?: string, position_name?: string }) {
        return this.positionsService.updatePosition(+positionId, body);
    }

    // Delete position (protected)
    @UseGuards(JwtAuthguard)
    @Delete(':position_id')
    async remove(@Param('position_id') positionId: string) {
        return this.positionsService.deletePosition(+positionId);
    }
}