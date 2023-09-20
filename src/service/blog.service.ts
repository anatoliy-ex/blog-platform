// import { Injectable } from '@nestjs/common';
// import { BlogsRepositories } from '../repositories/blog.repositories';
// import { LikeStatusesEnum, PostsTypes, UserLikes } from '../types/post.types';
// import { BlogsTypes, OutputType } from '../types/blog.types';
// import { PaginationQueryTypeForPostsAndComments } from '../pagination/post.pagination';
// import { PaginationQueryTypeForBlogs } from '../pagination/blog.pagination';
//
// @Injectable()
// export class BlogsService {
//   constructor(protected blogsRepositories: BlogsRepositories) {}
//
//   //return all blogs+++
//   async allBlogs(
//     pagination: PaginationQueryTypeForBlogs,
//   ): Promise<OutputType<BlogsTypes[]>> {
//     return this.blogsRepositories.allBlogs(pagination);
//   }
//
//   //create new blog+++
//   async createNewBlog(blog: BlogsTypes): Promise<BlogsTypes> {
//     const now = new Date();
//
//     const newBlog = {
//       id: `${Date.now()}`,
//       name: blog.name,
//       description: blog.description,
//       websiteUrl: blog.websiteUrl,
//       createdAt: now.toISOString(),
//       isMembership: false,
//     };
//
//     return this.blogsRepositories.createNewBlog(newBlog);
//   }
//
//   //get posts for specified blog
//   async getPostsForBlog(
//     pagination: PaginationQueryTypeForPostsAndComments,
//     blogId: string,
//     userId: string | null,
//   ) {
//     const posts = await this.blogsRepositories.getPostsForBlog(
//       pagination,
//       blogId,
//       userId,
//     );
//     const countOfPosts = await PostModel.countDocuments({ blogId });
//     const pageCount = Math.ceil(countOfPosts / pagination.pageSize);
//
//     return {
//       page: pagination.pageNumber,
//       pagesCount: pageCount === 0 ? 1 : pageCount,
//       pageSize: pagination.pageSize,
//       totalCount: countOfPosts,
//       items: posts,
//     };
//   }
//
//   //create new post for specific blog+++
//   async createPostForSpecificBlog(
//     post: PostsTypes<UserLikes>,
//     blogId: string,
//     blogName: string,
//   ): Promise<PostsTypes<UserLikes>> {
//     const now = new Date();
//
//     const newPost = {
//       id: `${Date.now()}`,
//       title: post.title,
//       shortDescription: post.shortDescription,
//       content: post.content,
//       blogId: blogId,
//       blogName: blogName,
//       createdAt: now.toISOString(),
//       extendedLikesInfo: {
//         likesCount: 0,
//         dislikesCount: 0,
//         myStatus: LikeStatusesEnum.None,
//         newestLikes: [],
//       },
//     };
//
//     return this.blogsRepositories.createPostForSpecificBlog(newPost);
//   }
//
//   //get blog bu ID+++
//   async getBlogById(id: string): Promise<BlogsTypes | null> {
//     return await this.blogsRepositories.getBlogById(id);
//   }
//
//   //update blog by ID+++
//   async updateBlog(newBlog: BlogsTypes, id: string): Promise<boolean> {
//     return await this.blogsRepositories.updateBlog(newBlog, id);
//   }
//
//   //delete blog byID+++
//   async deleteBlogById(id: string): Promise<boolean> {
//     return await this.blogsRepositories.deleteBlogById(id);
//   }
// }
