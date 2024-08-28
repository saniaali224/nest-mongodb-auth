/* eslint-disable prettier/prettier */

import { Schema } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';

@Schema()
export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsString()
  displayName?: string;
}
