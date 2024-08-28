/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';
import mongoose from 'mongoose';
import { UpdateUserDTO } from './dto/updateUserDto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    //console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findUsers() {
    console.log('env:', process.env.dbUri);
    return this.userService.getUsers();
  }
  @Get('/:id')
  findSingleUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Id not valid', 404);
    const User = this.userService.getSingleUser(id);
    if (!User) throw new HttpException('User Not Found', 404);
    return User;
  }

  @Patch('update/:id')
  @UsePipes(new ValidationPipe())
  updateUserSettings(
    @Param('id') id: string,
    @Body() updateuserDto: UpdateUserDTO,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Id not valid', 404);
    const updatedUser = this.userService.updateUser(id, updateuserDto);
    if (!updatedUser) throw new HttpException('user not found', 404);
    return updatedUser;
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Id not valid', 404);
    const UserDeleted = this.userService.deleteUser(id);
    console.log(UserDeleted);
  }
}