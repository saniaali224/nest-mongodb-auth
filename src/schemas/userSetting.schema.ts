/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserSettings {
  @Prop({ required: false })
  recievedNotifications: boolean;

  @Prop({ required: false })
  recieveEmails: boolean;

  @Prop()
  recieveSms: boolean;
}
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
