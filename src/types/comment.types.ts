import { LikeStatusesEnum } from '../shame/comment.Schema';

export type UserConfirmTypes = {
  id: string;
  login: string;
  hash: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
};

export type UserIsNotConfirmTypes = {
  id: string;
  login: string;
  hash: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
  confirmationCode: string;
  expirationDate: number | Date;
};

export type InputUserType = {
  login: string;
  password: string;
  email: string;
};

export type UserViewType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type TypeViewCommentModel<T, Y> = {
  id: string;
  content: string;
  commentatorInfo: T;
  createdAt: string;
  postId: string;
  likesInfo: Y;
};

export type TypeCommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type TypeLikeAndDislikeInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

export type LikeStatusUserForComment = {
  commentId: string;
  userStatus: LikeStatusesEnum;
  userId: string;
};
