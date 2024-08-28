/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Posts extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
