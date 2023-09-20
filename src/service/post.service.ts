// import { Injectable } from '@nestjs/common';
// import { PostsRepositories } from '../repositories/post.repositories';
// import { LikeStatusesEnum, PostsTypes, UserLikes } from '../types/post.types';
// import { PaginationQueryTypeForPostsAndComments } from '../pagination/post.pagination';
//
// @Injectable()
// export class PostsService {
//   constructor(protected postsRepositories: PostsRepositories) {}
//
//   //return all posts
//   async allPosts(
//     pagination: PaginationQueryTypeForPostsAndComments,
//     userId: string | null,
//   ) {
//     return this.postsRepositories.allPosts(pagination, userId);
//   }
//
//   //create new post+++
//   async createNewPost(post: PostsTypes<UserLikes>, blogName: string) {
//     const now = new Date();
//
//     const newPost = {
//       id: `${Date.now()}`,
//       title: post.title,
//       shortDescription: post.shortDescription,
//       content: post.content,
//       blogId: post.blogId,
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
//     return this.postsRepositories.createNewPost(newPost);
//   }
//
//   //get post by ID
//   async getPostById(id: string, userId: string | null) {
//     return await this.postsRepositories.getPostById(id, userId);
//   }
//
//   //update post by ID
//   async updatePost(
//     newPost: PostsTypes<UserLikes>,
//     id: string,
//   ): Promise<boolean> {
//     return await this.postsRepositories.updatePost(newPost, id);
//   }
//
//   //delete post by ID
//   async deletePostsById(id: string): Promise<boolean> {
//     return await this.postsRepositories.deletePostsById(id);
//   }
// }
