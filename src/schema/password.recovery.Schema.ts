import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordRecoveryDocument =
  HydratedDocument<PasswordRecoveryDbSchema>;
@Schema
export class PasswordRecoveryDbSchema {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  confirmCode: string;

  @Prop({ required: true })
  dateAt: string;
}

export const PasswordRecoverySchema = SchemaFactory.createForClass(
  PasswordRecoveryDbSchema,
);
