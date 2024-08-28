/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UserSettingsDto {
  @IsOptional()
  @IsBoolean()
  recievedNotifications: boolean;

  @IsOptional()
  @IsBoolean()
  recieveEmails: boolean;
  @IsOptional()
  @IsBoolean()
  recieveSms: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  displayName?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => UserSettingsDto)
  settings?: UserSettingsDto;
}
