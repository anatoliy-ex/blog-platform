import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<CommentOut>;

@Schema()
export class LikeAndDislikeInfo {
  @Prop({ required: true, default: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0 })
  dislikesCount: number;

  @Prop({ required: true, default: 'None' })
  myStatus: LikeStatusesEnum;
}

@Schema()
export class CommentOut {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  commentatorInfo: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  likesInfo: LikeAndDislikeInfo;

  //example for add method for class User
  // setAge(newAge: number) {
  //   if (newAge <= 0) throw Error('Bad req!!!');
  //   this.id = newAge;
  // }
}
//так можно добавлять методы для классов
// UserSchema.methods = {
//   setAge: User.prototype.setAge,
// };

export enum LikeStatusesEnum {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export const CommentSchema = SchemaFactory.createForClass(CommentOut);
