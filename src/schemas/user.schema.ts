/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserSettings } from './userSetting.schema';
import { Posts } from './post.schema';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;
  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  AvatarUrl?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings' })
  settings?: UserSettings;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Posts' })
  posts: Posts[];
}
export const UserSchema = SchemaFactory.createForClass(User);
