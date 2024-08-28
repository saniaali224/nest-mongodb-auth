/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  content: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
