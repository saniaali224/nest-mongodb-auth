/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import { Multer } from 'multer';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDTO } from './dto/updateUserDto';
import { ConfigService } from '@nestjs/config';
import { UserSettings } from 'src/schemas/userSetting.schema';

@Injectable()
export class UsersService {
  private s3: AWS.S3;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingModel: Model<UserSettings>,
    private configService: ConfigService,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async uploadImageToS3(file: Multer.File): Promise<string> {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: `${Date.now().toString()}-${file.originalname}`,
        Body: file.buffer,
        // This allows the file to be publicly accessible
        ContentType: file.mimetype,
      })
      .promise();

    return uploadResult.Location; // This is the URL of the uploaded image
  }
  async createUser(
    { settings, password, ...CreateUserDto }: CreateUserDto,
    file: Multer.File,
  ) {
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

    // Upload image to S3 if provided
    let avatarUrl = null;
    if (file) {
      avatarUrl = await this.uploadImageToS3(file);
    }

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
      AvatarUrl: avatarUrl,
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
