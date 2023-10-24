import { Injectable } from '@nestjs/common';
import { PaginationQueryTypeForBlogs } from '../pagination/blog.pagination';
import { BlogsTypes, BlogViewType } from '../types/blog.types';
import { PaginationQueryTypeForPostsAndComments } from '../pagination/post.pagination';
import { PostsTypes, UserLikes, UserLikesView } from '../types/post.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { BlogDbSchema, BlogDocument } from '../schema/blog.Schema';
import { PostDbSchema, PostDocument } from '../schema/post.Schema';
import { LikeStatusesEnum } from '../schema/comment.Schema';
import {
  LikeStatusForPostDbSchema,
  LikeStatusForPostDocument,
} from '../schema/like.status.for.post.Schema';

@Injectable()
export class BlogsRepositories {
  constructor(
    @InjectModel(BlogDbSchema.name)
    private blogModel: Model<BlogDocument>,
    @InjectModel(PostDbSchema.name)
    private postModel: Model<PostDocument>,
    @InjectModel(LikeStatusForPostDbSchema.name)
    private likeModelForPost: Model<LikeStatusForPostDocument>,
  ) {}

  async getAllBlog(pagination: PaginationQueryTypeForBlogs) {
    const filter = {
      name: { $regex: pagination.searchNameTerm, $options: 'i' },
    };

    const blogs: BlogsTypes[] = await this.blogModel
      .find(filter, { _id: 0, __v: 0, extendedLikesInfo: { _id: 0 } })
      // .select('-_id - __v')
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .skip((pagination.pageNumber - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .lean();

    console.log(blogs);

    const countOfBlogs = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(countOfBlogs / pagination.pageSize);

    return {
      page: pagination.pageNumber,
      pagesCount: pagesCount === 0 ? 1 : pagesCount,
      pageSize: pagination.pageSize,
      totalCount: countOfBlogs,
      items: blogs,
    };
  }

  async createNewBlog(newBlog: BlogsTypes) {
    await this.blogModel.create({ ...newBlog });
    return newBlog;
  }

  async getPostsForBlog(
    pagination: PaginationQueryTypeForPostsAndComments,
    blogId: string,
    userId: string | null,
  ) {
    const filter = { blogId: { $regex: blogId } };

    const postsModel: PostsTypes<UserLikesView>[] = await this.postModel
      .find(filter)
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .skip((pagination.pageNumber - 1) * pagination.pageSize)
      .limit(pagination.pageSize)
      .select('-_id -__v -extendedLikesInfo._id')
      .lean();

    const posts = [...postsModel];
    console.log('posts:', posts);
    if (userId == null) {
      return posts;
    }
    {
      return Promise.all(
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
    }
  }

  async createPostForSpecificBlog(newPost: PostsTypes<UserLikes>) {
    await this.postModel.create({ ...newPost });
    return this.postModel
      .findOne({ id: newPost.id })
      .select('-_id -__v -extendedLikesInfo._id');
  }

  async getBlogById(blogId: string): Promise<BlogsTypes | null> {
    const blog = await this.blogModel.findOne(
      { id: blogId },
      { _id: 0, __v: 0 },
    );
    if (blog) {
      return blog;
    } else {
      return null;
    }
  }

  async updateBlog(newBlog: BlogViewType, id: string) {
    const result: mongo.UpdateResult = await this.blogModel.updateOne(
      { id: id },
      {
        $set: {
          name: newBlog.name,
          description: newBlog.description,
          websiteUrl: newBlog.websiteUrl,
        },
      },
    );
    return result.matchedCount === 1;
  }

  //delete blog byID
  async deleteBlogById(id: string) {
    const isDeleted: mongo.DeleteResult = await this.blogModel.deleteOne({
      id: id,
    });
    return isDeleted.deletedCount === 1;
  }
}
