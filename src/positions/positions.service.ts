// I modified all "users" content to "positions" content

import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { RowDataPacket, OkPacket } from "mysql2";

@Injectable()
export class PositionsService {
    constructor(private db: DatabaseService) {}

    private pool = () => this.db.getPool();

    async createPosition(position_code: string, position_name: string, user_id: number) {
        const [result] = await this.pool().execute<OkPacket>(
            'INSERT INTO positions (position_code, position_name, id) VALUES (?, ?, ?)',
            [position_code, position_name, user_id],
        );
        return { position_id: result.insertId, position_code, position_name, id: user_id };
    }

    async findById(position_id: number) {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code, position_name, id, created_at, updated_at FROM positions WHERE position_id = ?',
            [position_id],
        );
        return rows[0];
    }

    async getAll() {
        const [rows] = await this.pool().execute<RowDataPacket[]>(
            'SELECT position_id, position_code, position_name, id, created_at, updated_at FROM positions',
        );
        return rows;
    }

    async updatePosition(position_id: number, partial: { position_code?: string; position_name?: string }) {
        const fields: string[] = [];
        const values: any[] = [];
        
        if (partial.position_code) {
            fields.push('position_code = ?');
            values.push(partial.position_code);
        }
        
        if (partial.position_name) {
            fields.push('position_name = ?');
            values.push(partial.position_name);
        }

        if (fields.length === 0) return await this.findById(position_id);
        values.push(position_id);
        const sql = `UPDATE positions SET ${fields.join(', ')} WHERE position_id = ?`;
        await this.pool().execute(sql, values);
        return this.findById(position_id);
    }

    async deletePosition(position_id: number) {
        const [res] = await this.pool().execute<OkPacket>('DELETE FROM positions WHERE position_id = ?', [position_id]);
        return res.affectedRows > 0;
    }
}