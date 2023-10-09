export enum LikeStatusesEnum {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export type PostsTypes<T> = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusesEnum;
    newestLikes: T[];
  };
};

export type UserLikes = {
  addedAt: string;
  userId: string;
  postId: string;
  login: string;
  likeStatus: string;
};

export type UserLikesView = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ViewTypePost<T> = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusesEnum;
    newestLikes: T[];
  };
};

export type PostViewType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
