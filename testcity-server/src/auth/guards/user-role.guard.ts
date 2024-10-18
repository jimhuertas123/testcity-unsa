import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";
import { META_ROLES } from "../decorators";

@Injectable()
export class UserRoleGuard implements CanActivate{

    constructor(
        private readonly reflector: Reflector
    ){}

    canActivate(context: ExecutionContext
        ): boolean | Promise<boolean> | Observable<boolean> {

        //return rol-user
        const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler() )
        
        if(!validRoles) return true;
        if( validRoles.length === 0 ) return true;

        //return user
        const req = context.switchToHttp().getRequest();
        const user = req.user as User;
        
        if (!user)
            throw new BadRequestException('User not Found')
        
        // console.log({userRole: user.roles});
        
        for(const role of user.roles){
            if (validRoles.includes(role)){
                return true;
            }
        }

        throw new ForbiddenException(`User ${user.fullName} needs a valid role: ${validRoles}`)
    }
}