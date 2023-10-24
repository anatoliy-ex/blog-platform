import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusesEnum } from './comment.Schema';
import { HydratedDocument } from 'mongoose';

export type LikeStatusForCommentDocument =
  HydratedDocument<LikeStatusForCommentDbSchema>;
@Schema()
export class LikeStatusForCommentDbSchema {
  @Prop({ required: true })
  commentId: string;

  @Prop({ required: true })
  userStatus: LikeStatusesEnum;

  @Prop({ required: true })
  userId: string;
}
export const LikeStatusForCommentSchema = SchemaFactory.createForClass(
  LikeStatusForCommentDbSchema,
);
