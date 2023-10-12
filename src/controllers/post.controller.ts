import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from '../service/post.service';
import { CommentRepositories } from '../repositories/comment.repositories';
import { PostsRepositories } from '../repositories/post.repositories';
import {
  getPaginationFromQueryPostsAndComments,
  PaginationQueryTypeForPostsAndComments,
} from '../pagination/post.pagination';
import { BlogsRepositories } from '../repositories/blog.repositories';
import { PostViewType } from '../types/post.types';
import { PostPutViewModel } from '../types/blog.types';

@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentRepositories: CommentRepositories,
    protected postsRepositories: PostsRepositories,
    protected blogsRepositories: BlogsRepositories,
  ) {}

  @HttpCode(200)
  @Get(':postId/comments')
  async getCommentsForPost(
    @Param('id') postId: string,
    @Headers('authorization') userIdView: string | null,
    @Query() query: PaginationQueryTypeForPostsAndComments,
  ) {
    const post = await this.postsRepositories.getPostById(postId);

    if (post) {
      const paginationComments = getPaginationFromQueryPostsAndComments(query);
      return await this.postsRepositories.getCommentsForPost(
        paginationComments,
        postId,
        userIdView,
      );
    } else {
      throw new NotFoundException();
    }

    // let userId = null;
    // if (!userIdView) userId = null;
    //
    // const token = userIdView?.split(' ')[1];
    // if (!token) userId = null;
    // try {
    //   const IsDecode: any = jwt.verify(token!, settings.JWT_SECRET);
    //
    //   if (IsDecode) {
    //     const user = authUsersRepositories.getUserWithAccessToken(token!);
    //
    //     if (user === null) {
    //       userId = null;
    //     } else {
    //       userId = user.id;
    //     }
    //   }
    // } catch (e) {
    //   userId = null;
    // }
    //
    // if (post) {
    //   const paginationComments = getPaginationFromQueryPostsAndComments(
    //     req.query,
    //   );
    //   const commentsForPost = this.postsRepositories.getCommentsForPost(
    //     paginationComments,
    //     req.params.postId,
    //     userId,
    //   );
    //   res.status(200).send(commentsForPost);
    // } else {
    //   res.sendStatus(404);
    // }
  }

  @HttpCode(200)
  @Get()
  async getAllPosts(@Query() query: PaginationQueryTypeForPostsAndComments) {
    // const userId = req.user ? req.user.id : null;
    console.log(query);
    const userId = null;
    const paginationPosts = getPaginationFromQueryPostsAndComments(query);
    console.log(paginationPosts);
    return await this.postsService.allPosts(paginationPosts, userId);
  }

  @HttpCode(201)
  @Post()
  async createNewPost(@Body() postViewModel: PostViewType) {
    console.log(postViewModel);
    const foundBlog: any = await this.blogsRepositories.getBlogById(
      postViewModel.blogId,
    );

    console.log(foundBlog);
    if (foundBlog == null) {
      throw new NotFoundException();
    } else {
      const blogName = foundBlog.name;
      return await this.postsService.createNewPost(postViewModel, blogName);
    }
  }

  @HttpCode(200)
  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const userId = null;

    const PostWithId = await this.postsService.getPostById(postId, userId);

    if (PostWithId) {
      return PostWithId;
    } else {
      throw new NotFoundException();
    }
  }

  @HttpCode(204)
  @Put(':id')
  async updatePostById(
    @Param('id') postId: string,
    @Body() body: PostPutViewModel,
  ) {
    const userId = null;
    const findBlogWithID = await this.blogsRepositories.getBlogById(
      body.blogId,
    );
    const findPostWithID = await this.postsService.getPostById(postId, userId);

    if (findBlogWithID && findPostWithID) {
      await this.postsService.updatePost(body, postId);
    } else {
      throw new NotFoundException();
    }
  }

  @HttpCode(204)
  @Delete(':id')
  async deletePostById(@Param('id') postId: string) {
    const isDelete = await this.postsService.deletePostsById(postId);

    if (!isDelete) {
      throw new NotFoundException();
    }
  }
}
