import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    update(req: any, dto: UpdateUserDto): Promise<import("./users.entity").User>;
    findOne(req: any): Promise<import("./users.entity").User>;
}
