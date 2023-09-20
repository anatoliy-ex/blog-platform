// import { Injectable } from '@nestjs/common';
// import { PostsService } from '../service/post.service';
// import { CommentRepositories } from '../repositories/comment.repositories';
// import { PostsRepositories } from '../repositories/post.repositories';
// import { getPaginationFromQueryPostsAndComments } from '../pagination/post.pagination';
//
// @Injectable()
// export class PostsController {
//   constructor(
//     protected postsService: PostsService,
//     protected commentRepositories: CommentRepositories,
//     protected postsRepositories: PostsRepositories, //protected blogsRepositories: BlogsRepositories,
//   ) {}
//
//   @Get()
//   getCommentsForPost(req: Request, res: Response) {
//     const post = this.postsRepositories.getPostById(req.params.postId);
//
//     let userId = null;
//     if (!req.headers.authorization) userId = null;
//
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) userId = null;
//     try {
//       const IsDecode: any = jwt.verify(token!, settings.JWT_SECRET);
//
//       if (IsDecode) {
//         const user = authUsersRepositories.getUserWithAccessToken(token!);
//
//         if (user === null) {
//           userId = null;
//         } else {
//           userId = user.id;
//         }
//       }
//     } catch (e) {
//       userId = null;
//     }
//
//     if (post) {
//       const paginationComments = getPaginationFromQueryPostsAndComments(
//         req.query,
//       );
//       const commentsForPost = this.postsRepositories.getCommentsForPost(
//         paginationComments,
//         req.params.postId,
//         userId,
//       );
//       res.status(200).send(commentsForPost);
//     } else {
//       res.sendStatus(404);
//     }
//   }
//
//   async GetAllPosts(req: Request, res: Response) {
//     const userId = req.user ? req.user.id : null;
//     const pagination = getPaginationFromQueryPostsAndComments(req.query);
//     const allPosts = this.postsService.allPosts(pagination, userId);
//     res.status(200).send(allPosts);
//   }
//
//   async CreateNewPost(req: Request, res: Response) {
//     const foundBlog: BlogsTypes | null = this.blogsRepositories.getBlogById(
//       req.body.blogId,
//     );
//
//     if (!foundBlog) {
//       res.sendStatus(404);
//     } else {
//       const blogName = foundBlog.name;
//       const newPost = this.postsService.createNewPost(req.body, blogName);
//       res.status(201).send(newPost);
//     }
//   }
//
//   async GetPostById(req: Request, res: Response) {
//     const userId = req.user ? req.user.id : null;
//
//     const PostWithId = await this.postsService.getPostById(
//       req.params.id,
//       userId,
//     );
//
//     if (PostWithId) {
//       res.status(200).send(PostWithId);
//       return;
//     } else {
//       res.sendStatus(404);
//       return;
//     }
//   }
//
//   async UpdatePostById(req: Request, res: Response) {
//     const userId = req.user ? req.user.id : null;
//     const findBlogWithID = this.blogsRepositories.getBlogById(req.body.blogId);
//     const findPostWithID = await this.postsService.getPostById(
//       req.params.id,
//       userId,
//     );
//
//     if (findBlogWithID && findPostWithID) {
//       await this.postsService.updatePost(req.body, req.params.id);
//       res.sendStatus(204);
//       return;
//     } else {
//       res.sendStatus(404);
//       return;
//     }
//   }
//
//   async DeletePostById(req: Request, res: Response) {
//     const isDelete = await this.postsService.deletePostsById(req.params.id);
//
//     if (isDelete) {
//       res.sendStatus(204);
//       return;
//     } else {
//       res.sendStatus(404);
//       return;
//     }
//   }
// }
