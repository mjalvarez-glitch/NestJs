import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { RowDataPacket, OkPacket } from "mysql2";

// Define the interface for the address data used in the service layer
interface AddressDto {
    label: string;
    recipient_name: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
}

// Interface for the data returned from the database
interface AddressRecord extends RowDataPacket {
    address_id: number;
    user_id: number;
    label: string;
    recipient_name: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    created_at: Date;
    updated_at: Date;
}


@Injectable()
export class UserAddressService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    // --- C: Create a new address for a specific user ---
    async createAddress(user_id: number, addressData: AddressDto) {
        // SQL query adapted to use the simplified table structure
        const [result] = await this.pool().execute<OkPacket>(
            `INSERT INTO user_addresses 
            (user_id, label, recipient_name, street_address, city, postal_code, country) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, 
                addressData.label, 
                addressData.recipient_name, 
                addressData.street_address, 
                addressData.city, 
                addressData.postal_code, 
                addressData.country
            ],
        );
        return { 
            address_id: result.insertId, 
            user_id, 
            ...addressData 
        };
    }

    // --- R: Find a single address by ID AND user_id (Security Check) ---
    async findOneByIdAndUserId(address_id: number, user_id: number): Promise<AddressRecord | undefined> {
        const [rows] = await this.pool().execute<AddressRecord[]>(
            `SELECT * FROM user_addresses 
            WHERE address_id = ? AND user_id = ?`, // CRITICAL: Scopes the result to the user
            [address_id, user_id],
        );
        return rows[0];
    }

    // --- R: Get all addresses for a specific user ---
    async findAllByUserId(user_id: number): Promise<AddressRecord[]> {
        const [rows] = await this.pool().execute<AddressRecord[]>(
            `SELECT * FROM user_addresses 
            WHERE user_id = ?`, // CRITICAL: Only returns the user's addresses
            [user_id],
        );
        return rows;
    }

    // --- U: Update an existing address (scoped by user_id) ---
    async updateAddress(address_id: number, user_id: number, partial: Partial<AddressDto>) {
        const fields: string[] = [];
        const values: any[] = [];

        // Define the valid keys we are expecting
        const validKeys: Array<keyof AddressDto> = [
            'label', 
            'recipient_name', 
            'street_address', 
            'city', 
            'postal_code', 
            'country'
        ];
        
        // Dynamically build the SET clause based on provided fields
        for (const key of Object.keys(partial)) {
            // Use type assertion to tell TypeScript the key is valid
            const addressKey = key as keyof AddressDto;

            // 1. Ensure the key is one of our expected database columns
            // 2. Ensure the value is not undefined (it could be null if you allowed it, but not undefined)
            if (validKeys.includes(addressKey) && partial[addressKey] !== undefined) {
                fields.push(`${addressKey} = ?`);
                values.push(partial[addressKey]);
            }
        }

        if (fields.length === 0) {
            // If no fields were provided, just return the existing record
            const existing = await this.findOneByIdAndUserId(address_id, user_id);
            if (!existing) throw new NotFoundException(`Address with ID ${address_id} not found for this user.`);
            return existing;
        }
        
        // Add the criteria for the WHERE clause
        values.push(address_id, user_id);

        const sql = `
            UPDATE user_addresses 
            SET ${fields.join(', ')} 
            WHERE address_id = ? AND user_id = ?`; // CRITICAL: Updates only the user's address
        
        const [result] = await this.pool().execute<OkPacket>(sql, values);

        if (result.affectedRows === 0) {
            // Throw an exception if no row was updated (either not found or not owned by user)
            throw new NotFoundException(`Address with ID ${address_id} not found for this user.`);
        }
        
        // Return the updated address record
        return this.findOneByIdAndUserId(address_id, user_id);
    }

    // --- D: Delete an address (scoped by user_id) ---
    async deleteAddress(address_id: number, user_id: number) {
        // Delete statement includes the user_id for security
        const [res] = await this.pool().execute<OkPacket>(
            `DELETE FROM user_addresses 
            WHERE address_id = ? AND user_id = ?`, // CRITICAL: Deletes only the user's address
            [address_id, user_id]
        );
        
        // Return true if an address was deleted, false otherwise
        if (res.affectedRows === 0) {
            // Optionally throw NotFoundException here, depending on desired controller behavior
            return false; 
        }

        return true;
    }
}