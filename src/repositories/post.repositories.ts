import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDbSchema, BlogDocument } from '../shame/blog.Schema';
import { Model, mongo } from 'mongoose';
import { PostDbSchema, PostDocument } from '../shame/post.Schema';
import {
  LikeStatusForPostDbSchema,
  LikeStatusForPostDocument,
} from '../shame/like.status.for.post.Schema';
import {
  CommentDocument,
  CommentOut,
  LikeStatusesEnum,
} from '../shame/comment.Schema';
import { UserDbSchema, UserDocument } from '../shame/user.Schema';
import {
  TypeCommentatorInfo,
  TypeLikeAndDislikeInfo,
  TypeViewCommentModel,
  UserConfirmTypes,
} from '../types/comment.types';
import { PostsTypes, UserLikes, UserLikesView } from '../types/post.types';
import { PaginationQueryTypeForPostsAndComments } from '../pagination/post.pagination';
import { PostPutViewModel, OutputType } from '../types/blog.types';
import {
  LikeStatusForCommentDbSchema,
  LikeStatusForCommentDocument,
} from '../shame/like.status.for.comment.Schema';

@Injectable()
export class PostsRepositories {
  constructor(
    @InjectModel(BlogDbSchema.name)
    private blogModel: Model<BlogDocument>,
    @InjectModel(PostDbSchema.name)
    private postModel: Model<PostDocument>,
    @InjectModel(LikeStatusForPostDbSchema.name)
    private likeModelForPost: Model<LikeStatusForPostDocument>,
    @InjectModel(UserDbSchema.name)
    private userModel: Model<UserDocument>,
    @InjectModel(CommentOut.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(LikeStatusForCommentDbSchema.name)
    private likeModelForComment: Model<LikeStatusForCommentDocument>,
  ) {}
  //update like and dislike status for post
  // async updateLikeAndDislikeStatusForPost(
  //   postId: string,
  //   likeStatus: LikeStatusesEnum,
  //   userId: string,
  // ) {
  //   const user = await this.userModel.findOne({ id: userId });
  //   const isUserLiked = await this.likeModelForPost.findOne({ postId, userId });
  //   if (!isUserLiked) {
  //     await this.likeModelForPost.create({
  //       likeStatus: likeStatus,
  //       login: user!.login,
  //       postId: postId,
  //       userId: userId,
  //       addedAt: new Date(),
  //     });
  //   } else {
  //     await this.likeModelForPost.updateOne(
  //       { postId, userId },
  //       { $set: { likeStatus: likeStatus, login: user!.login } },
  //     );
  //   }
  //
  //   const likesCount = await this.likeModelForPost.countDocuments({
  //     postId,
  //     likeStatus: LikeStatusesEnum.Like,
  //   });
  //   const dislikesCount = await this.likeModelForPost.countDocuments({
  //     postId,
  //     likeStatus: LikeStatusesEnum.Dislike,
  //   });
  //
  //   await this.postModel.updateOne(
  //     { id: postId },
  //     {
  //       $set: {
  //         'extendedLikesInfo.likesCount': likesCount,
  //         'extendedLikesInfo.dislikesCount': dislikesCount,
  //       },
  //     },
  //   );
  // }

  //get comments for post
  async getCommentsForPost(
    pagination: PaginationQueryTypeForPostsAndComments,
    postId: string,
    userId?: string | null,
  ) {
    const filter = { postId: postId };
    console.log(postId);

    const comments: TypeViewCommentModel<
      TypeCommentatorInfo,
      TypeLikeAndDislikeInfo
    >[] = await this.commentModel
      .find(filter, { _id: 0, __v: 0, postId: 0 })
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .skip((pagination.pageNumber - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .lean();

    console.log(comments);

    const countOfComments = await this.commentModel.countDocuments(filter);
    const pagesCount = Math.ceil(countOfComments / pagination.pageSize);

    if (userId == null) {
      return {
        page: pagination.pageNumber,
        pagesCount: pagesCount === 0 ? 1 : pagesCount,
        pageSize: pagination.pageSize,
        totalCount: countOfComments,
        items: comments,
      };
    } else {
      const commentsWithStatuses = await Promise.all(
        comments.map(async (c) => {
          const findUser: any = await this.likeModelForComment.findOne(
            { commentId: c.id, userId: userId },
            {
              _id: 0,
              userStatus: 1,
            },
          );

          if (findUser) {
            c.likesInfo.myStatus = findUser.userStatus;
            return c;
          }
          return c;
        }),
      );

      return {
        page: pagination.pageNumber,
        pagesCount: pagesCount === 0 ? 1 : pagesCount,
        pageSize: pagination.pageSize,
        totalCount: countOfComments,
        items: commentsWithStatuses,
      };
    }
  }

  //create comment for post
  async createCommentForPost(
    postId: string,
    content: string,
    user: UserConfirmTypes,
  ): Promise<
    TypeViewCommentModel<TypeCommentatorInfo, TypeLikeAndDislikeInfo>
  > {
    const now = new Date();

    const newComment = {
      id: `${Date.now()}`,
      content: content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: now.toISOString(),
      postId: postId,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusesEnum.None,
      },
    };
    console.log(newComment.id);

    await this.commentModel.insertMany([newComment]);
    return newComment;
  }

  //return all posts
  async allPosts(
    pagination: PaginationQueryTypeForPostsAndComments,
    userId: string | null,
  ): Promise<OutputType<PostsTypes<UserLikesView>[]>> {
    const postsModel: PostsTypes<UserLikesView>[] = await this.postModel
      .find({}, { _id: 0, __v: 0, extendedLikesInfo: { _id: 0 } })
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .skip((pagination.pageNumber - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .select('-_id -__v')
      .lean();

    const countOfPosts = await this.postModel.countDocuments();
    const pageCount = Math.ceil(countOfPosts / pagination.pageSize);

    const posts = [...postsModel];
    if (userId == null) {
      return {
        page: pagination.pageNumber,
        pagesCount: pageCount === 0 ? 1 : pageCount,
        pageSize: pagination.pageSize,
        totalCount: countOfPosts,
        items: posts,
      };
    } else {
      const postsWithStatuses = await Promise.all(
        posts.map(async (c) => {
          const findUserModel = await this.likeModelForPost
            .findOne({
              postId: c.id,
              userId: userId,
            })
            .lean();
          const newestLikes: UserLikes[] = await this.likeModelForPost
            .find({
              postId: c.id,
              likeStatus: LikeStatusesEnum.Like,
            })
            .sort({
              ['addedAt']: 'desc',
            })
            .select('-_id -__v')
            .limit(3)
            .lean();

          if (findUserModel) {
            const findUser: any = { ...findUserModel };
            c.extendedLikesInfo.myStatus = findUser.likeStatus;
          }
          if (newestLikes) {
            c.extendedLikesInfo.newestLikes = newestLikes.map((like) => ({
              addedAt: like.addedAt,
              userId: like.userId,
              login: like.login,
            }));
          }

          return c;
        }),
      );

      return {
        page: pagination.pageNumber,
        pagesCount: pageCount === 0 ? 1 : pageCount,
        pageSize: pagination.pageSize,
        totalCount: countOfPosts,
        items: postsWithStatuses,
      };
    }
  }

  //create new post
  async createNewPost(newPost: PostsTypes<UserLikes>) {
    await this.postModel.create({ ...newPost });

    const viewPost = await this.postModel
      .findOne({ id: newPost.id })
      .select('-__v -_id');

    if (viewPost != null) {
      return newPost;
    } else {
      return null;
    }
  }

  //get post by ID
  async getPostById(postId: string, userId?: string | null) {
    const postModel: PostsTypes<UserLikesView> | null = await this.postModel
      .findOne({ id: postId }, { extendedLikesInfo: { _id: 0 } })
      .select('-_id -__v')
      .lean();

    if (!postModel) return false;

    const post: any = { ...postModel };

    console.log(post, 'post');

    const newestLikes: UserLikes[] = await this.likeModelForPost
      .find({
        postId,
        likeStatus: LikeStatusesEnum.Like,
      })
      .sort({
        ['addedAt']: 'desc',
      })
      .select('-_id -__v')
      .limit(3)
      .lean();

    console.log(newestLikes, 'newestLikes');

    if (newestLikes) {
      post.extendedLikesInfo.newestLikes = newestLikes.map(
        (like: UserLikesView) => ({
          addedAt: like.addedAt,
          userId: like.userId,
          login: like.login,
        }),
      );
    }

    if (!userId) return post;
    const isUserLiked1 = await this.likeModelForPost
      .findOne({ userId: userId, postId: postId }, { _id: 0, __v: 0 })
      .lean();

    const isUserLiked: any = { ...isUserLiked1 };

    console.log(isUserLiked, 'isUserLiked');
    if (!isUserLiked) return post;
    if (!isUserLiked.likeStatus) return post;
    post.extendedLikesInfo.myStatus = isUserLiked.likeStatus;
    return post;
  }

  //update post by ID
  async updatePost(newPost: PostPutViewModel, id: string): Promise<boolean> {
    const result: mongo.UpdateResult = await this.postModel.updateOne(
      { id: id },
      {
        $set: {
          title: newPost.title,
          shortDescription: newPost.shortDescription,
          content: newPost.content,
          blogId: newPost.blogId,
        },
      },
    );
    return result.matchedCount === 1;
  }

  //delete post by ID
  async deletePostsById(id: string): Promise<boolean> {
    const isDeleted: mongo.DeleteResult = await this.postModel.deleteOne({
      id: id,
    });
    return isDeleted.deletedCount === 1;
  }
}
