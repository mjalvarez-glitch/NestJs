import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from "@nestjs/common";
import { UserAddressService } from "./user_address.service";
import { JwtAuthguard } from "../auth/jwt-auth.guard";
import { Request as ExpressRequest } from 'express'; 

interface AddressDto {
    label: string;
    recipient_name: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
}

// Controller with Guard applied to all routes
@Controller('user-addresses')
@UseGuards(JwtAuthguard) 
export class UserAddressController {
    
    constructor(private userAddressService: UserAddressService) {}

    // Helper to securely extract the user ID from the request object (token payload)
    private getUserId(req: ExpressRequest & { user: { id: number; username: string; role: string; } }): number {
        return req.user.id;
    }

    // 1. READ: Get all addresses for the logged-in user
    // GET /user-addresses
    @Get()
    async getAll(@Request() req: ExpressRequest & { user: { id: number; username: string; role: string; } }) {
        const user_id = this.getUserId(req);
        return this.userAddressService.findAllByUserId(user_id);
    }

    // 2. READ: Get a single address by its ID (scoped by user ID)
    // GET /user-addresses/:address_id
    @Get(':address_id')
    async getOne(
        @Param('address_id') addressId: string,
        @Request() req: ExpressRequest & { user: { id: number; username: string; role: string; } }
    ) {
        const user_id = this.getUserId(req);
        // Important: Service finds the record WHERE address_id = ? AND user_id = ?
        return this.userAddressService.findOneByIdAndUserId(+addressId, user_id);
    }

    // 3. CREATE: Create a new address for the logged-in user
    // POST /user-addresses
    @Post()
    async create(
        @Body() body: AddressDto, 
        @Request() req: ExpressRequest & { user: { id: number; username: string; role: string; } }
    ) {
        const user_id = this.getUserId(req); 
        
        // Pass the user_id and the address data to the service
        return this.userAddressService.createAddress(user_id, body);
    }

    // 4. UPDATE: Update an existing address (scoped by user ID)
    // PUT /user-addresses/:address_id
    @Put(':address_id')
    async update(
        @Param('address_id') addressId: string, 
        @Body() body: Partial<AddressDto>, // Allows updating only a subset of fields
        @Request() req: ExpressRequest & { user: { id: number; username: string; role: string; } }
    ) {
        const user_id = this.getUserId(req);

        // Important: Service updates the record WHERE address_id = ? AND user_id = ?
        return this.userAddressService.updateAddress(+addressId, user_id, body);
    }

    // 5. DELETE: Remove an address (scoped by user ID)
    // DELETE /user-addresses/:address_id
    @Delete(':address_id')
    async remove(
        @Param('address_id') addressId: string,
        @Request() req: ExpressRequest & { user: { id: number; username: string; role: string; } }
    ) {
        const user_id = this.getUserId(req);

        // Important: Service deletes the record WHERE address_id = ? AND user_id = ?
        return this.userAddressService.deleteAddress(+addressId, user_id);
    }
}