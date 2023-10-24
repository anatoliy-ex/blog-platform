import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikeStatusForPostDocument =
  HydratedDocument<LikeStatusForPostDbSchema>;
@Schema()
export class LikeStatusForPostDbSchema {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  likeStatus: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  login: string;
}
export const LikeStatusForPostSchema = SchemaFactory.createForClass(
  LikeStatusForPostDbSchema,
);
