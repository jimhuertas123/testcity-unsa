import { Controller, Get, Post, Body, Put, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, EditUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  
  @Get('user')
  @Auth(ValidRoles.admin)
  getAllUsers(){
    return this.authService.getAllUsers();
  }

  @Get('user/:id')
  @Auth(ValidRoles.admin)
  getUserByID(@Param('id', ParseUUIDPipe) id: string){
    return this.authService.getUserById(id);
  }

  @Put('user/:id')
  @Auth(ValidRoles.admin)
  editUser(@Param('id', ParseUUIDPipe) id: string, @Body() editUserDto: EditUserDto){
    return this.authService.editUserById(id, editUserDto)
  }

  @Delete('user/:id')
  @Auth(ValidRoles.admin)
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    return this.authService.removeUserById(id)
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }
}



