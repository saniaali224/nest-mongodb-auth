/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDTO } from './dto/updateUserDto';
import { UserSettings } from 'src/schemas/userSetting.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingModel: Model<UserSettings>,
  ) {}
  async createUser({ settings, password, ...CreateUserDto }: CreateUserDto) {
    // Check if the username already exists
    const existingUser = await this.userModel.findOne({
      username: CreateUserDto.username,
    });
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle settings if provided
    let savedSettings = null;
    if (settings) {
      const newSettings = new this.userSettingModel(settings);
      savedSettings = await newSettings.save();
    }

    // Create a new user with hashed password and optional settings
    const newUser = new this.userModel({
      ...CreateUserDto,
      password: hashedPassword,
      settings: savedSettings ? savedSettings._id : null,
    });

    return newUser.save();
  }

  getUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }
  getSingleUser(id: string) {
    return this.userModel.findById(id).populate(['settings', 'posts']);
  }
  updateUser(id: string, updateuserDto: UpdateUserDTO) {
    const updatedUser = this.userModel.findByIdAndUpdate(id, updateuserDto, {
      new: true,
    });
    return updatedUser;
  }
  deleteUser(id: string) {
    const UserDeleted = this.userModel.findByIdAndDelete(id);
    return UserDeleted;
  }
}
