import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserDbSchema>;
@Schema()
export class UserDbSchema {
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

  // @Prop({ required: true })
  // isConfirm: string;

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

@Schema()
export class UserOut {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: string;

  // @Prop({ required: true })
  // isConfirm: string;
}

@Schema()
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;
}
export const UserSchema = SchemaFactory.createForClass(UserOut);
