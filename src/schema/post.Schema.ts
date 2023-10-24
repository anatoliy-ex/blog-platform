import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusesEnum } from '../types/post.types';
import { LikeViewModel } from './like.Schema';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<PostDbSchema>;
@Schema()
export class ExtendedLikesInfo {
  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: LikeStatusesEnum;

  @Prop({ required: true })
  newestLikes: LikeViewModel[];
}

@Schema()
export class PostDbSchema {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  extendedLikesInfo: ExtendedLikesInfo;
}
export const PostSchema = SchemaFactory.createForClass(PostDbSchema);
