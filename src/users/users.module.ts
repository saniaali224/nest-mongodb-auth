/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  UserSettings,
  UserSettingsSchema,
} from 'src/schemas/userSetting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: UserSettings.name, schema: UserSettingsSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule],
})
export class UsersModule {}
