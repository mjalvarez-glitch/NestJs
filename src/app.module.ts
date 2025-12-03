import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PositionsModule } from "./positions/positions.module"; 
import { UserAddressModule } from "./user_address/user_address.module";

@Module({
    imports: [DatabaseModule, UsersModule, AuthModule, PositionsModule, UserAddressModule],
})
export class AppModule {}