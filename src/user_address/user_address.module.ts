import { Module } from "@nestjs/common";
import { UserAddressService } from "./user_address.service";
import { UserAddressController } from "./user_address.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [UserAddressController],
    providers: [UserAddressService],
    exports: [UserAddressService],
})
export class UserAddressModule {}