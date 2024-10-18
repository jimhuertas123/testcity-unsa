import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, EditUserDto, LoginUserDto } from './dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async checkAuthStatus( user: User ){
    return {
      ...user,
      token: this.getJwtToken({ id: user.id})
    };
  }

  async create(createUserDto: CreateUserDto) {

    try {
      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save( user );

      return {
        token: this.getJwtToken({ 
          id: user.id
        })
      };
    } catch (e) {
      this.handleDBErrors(e);
    }
  }

  async login(loginUserDto : LoginUserDto){
    const {email, password} = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, fullName: true, password: true, id:true}
    });

    if( !user ){
      throw new UnauthorizedException('Credenciales inválidas (email y/o contraseña)');
    }
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales inválidas (email y/o contraseña)')

    return {
      token: this.getJwtToken({ 
        id: user.id
      })
    };
  }


  async getAllUsers(){
    return await this.userRepository.find();
  }

  async getUserById(id: string){
    let user: User

    if( isUUID(id) ){
      const user = await this.userRepository.findOneBy({id: id})
      return user;
    }
    if(!user){
      throw new NotFoundException(`User with id: ${id} not found`)
    }
  }

  async editUserById(id:string, editUserDto: EditUserDto){
    if(id === 'ddc6c9d7-2124-4c26-a8bc-208192a9552e'){
      throw new UnauthorizedException('This user can\'t be modified');
    }

    const userData = editUserDto;
    
    let user = await this.userRepository.findOne({
      where: {id},
      select: { email: true, fullName: true, password: true, id:true, roles:true}
    });

    if( !user ){
      throw new NotFoundException(`User with id: ${id} not found`)
    }

    Object.assign(user, userData);

    user = await this.userRepository.save(user);

    return user;
  }


  async removeUserById(id:string){
    if(id === 'ddc6c9d7-2124-4c26-a8bc-208192a9552e'){
      throw new UnauthorizedException('This user can\'t be deleted');
    }
    const user: User = await this.getUserById(id)
    if(!user){
      throw new NotFoundException(`User with id: ${id} not found`)
    }
    
    await this.userRepository.remove(user);
    return {
      messsage: `User with id: ${id} removed`
    }
    
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBErrors(e: any): never{
    if (e.code === '23505')
      throw new BadRequestException(e.detail);
    throw new InternalServerErrorException('Error en el servidor, comunícate con el administrador de la página por este hecho.');
  }
}
