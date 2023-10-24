import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserNotConfirmationDocument =
  HydratedDocument<UserNotConfirmationDbSchema>;
@Schema
export class UserNotConfirmationDbSchema {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isConfirm: string;

  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: string;
}

export const UserNotConfirmationSchema = SchemaFactory.createForClass(
  UserNotConfirmationDbSchema,
);
