import { Injectable } from '@nestjs/common';
import { BlogsRepositories } from '../repositories/blog.repositories';
import { LikeStatusesEnum, PostViewType } from '../types/post.types';
import { BlogsTypes, BlogViewType } from '../types/blog.types';
import { PaginationQueryTypeForPostsAndComments } from '../pagination/post.pagination';
import { PaginationQueryTypeForBlogs } from '../pagination/blog.pagination';
import { InjectModel } from '@nestjs/mongoose';
import { PostDbSchema, PostDocument } from '../shame/post.Schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepositories: BlogsRepositories,
    @InjectModel(PostDbSchema.name)
    private postModel: Model<PostDocument>,
  ) {}

  //return all blogs+++
  async allBlogs(pagination: PaginationQueryTypeForBlogs) {
    return this.blogsRepositories.getAllBlog(pagination);
  }

  //create new blog+++
  async createNewBlog(blog: BlogViewType): Promise<BlogsTypes> {
    const now = new Date();

    const newBlog = {
      id: `${Date.now()}`,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: now.toISOString(),
      isMembership: false,
    };

    return this.blogsRepositories.createNewBlog(newBlog);
  }

  //get posts for specified blog
  async getPostsForBlog(
    pagination: PaginationQueryTypeForPostsAndComments,
    blogId: string,
    userId: string | null,
  ) {
    const posts = await this.blogsRepositories.getPostsForBlog(
      pagination,
      blogId,
      userId,
    );
    const countOfPosts = await this.postModel.countDocuments({ blogId });
    const pageCount = Math.ceil(countOfPosts / pagination.pageSize);

    return {
      page: pagination.pageNumber,
      pagesCount: pageCount === 0 ? 1 : pageCount,
      pageSize: pagination.pageSize,
      totalCount: countOfPosts,
      items: posts,
    };
  }

  //create new post for specific blog+++
  async createPostForSpecificBlog(
    post: PostViewType,
    blogId: string,
    blogName: string,
  ) {
    const now = new Date();

    const newPost = {
      id: `${Date.now()}`,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blogName,
      createdAt: now.toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusesEnum.None,
        newestLikes: [
          {
            addedAt: now.toISOString(),
            userId: ' ',
            login: ' ',
            likeStatus: LikeStatusesEnum.None,
            postId: ' ',
          },
        ],
      },
    };

    return this.blogsRepositories.createPostForSpecificBlog(newPost);
  }

  //get blog bu ID+++
  async getBlogById(id: string): Promise<BlogsTypes | null> {
    const blog = await this.blogsRepositories.getBlogById(id);
    if (blog) {
      return blog;
    } else {
      return null;
    }
  }

  //update blog by ID+++
  async updateBlog(newBlog: BlogViewType, id: string): Promise<boolean> {
    return await this.blogsRepositories.updateBlog(newBlog, id);
  }

  //delete blog byID+++
  async deleteBlogById(id: string): Promise<boolean> {
    return await this.blogsRepositories.deleteBlogById(id);
  }
}
