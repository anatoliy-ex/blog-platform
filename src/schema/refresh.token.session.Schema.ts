import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenSessionDocument =
  HydratedDocument<RefreshTokenSessionDbSchema>;
@Schema
export class RefreshTokenSessionDbSchema {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastActiveDate: string;

  @Prop({ required: true })
  userId: string;
}

export const RefreshTokenSessionSchema = SchemaFactory.createForClass(
  RefreshTokenSessionDbSchema,
);
