import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { BlogsService } from '../service/blog.service';
import {
  getPaginationFromQueryBlogs,
  PaginationQueryTypeForBlogs,
} from '../pagination/blog.pagination';
import { BlogsTypes, BlogViewType } from '../types/blog.types';
import {
  getPaginationFromQueryPostsAndComments,
  PaginationQueryTypeForPostsAndComments,
} from '../pagination/post.pagination';
import { PostsTypes, PostViewType, UserLikes } from '../types/post.types';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}

  @Get()
  async getAllBlogs(@Query() query: PaginationQueryTypeForBlogs) {
    const paginationBlogs = getPaginationFromQueryBlogs(query);
    return await this.blogsService.allBlogs(paginationBlogs);
  }

  @Post()
  async createNewBlog(@Body() blogViewModel: BlogViewType) {
    const newBlog: BlogsTypes = await this.blogsService.createNewBlog(
      blogViewModel,
    );

    if (newBlog) {
      return newBlog;
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':blogId/posts')
  async getPostsForSpecifiedBlog(
    @Query() query: PaginationQueryTypeForPostsAndComments,
    @Param('blogId') blogId: string,
  ) {
    console.log(blogId);
    const userId = null;
    const foundBlog: BlogsTypes | null = await this.blogsService.getBlogById(
      blogId,
    );

    console.log(foundBlog);
    if (foundBlog) {
      const pagination = getPaginationFromQueryPostsAndComments(query);
      return await this.blogsService.getPostsForBlog(
        pagination,
        foundBlog.id,
        userId,
      );
    } else {
      throw new NotFoundException();
    }
  }

  @Post(':blogId/posts')
  async createNewPostForSpecificBlog(
    @Param('id') blogId: string,
    @Body() body: PostViewType,
  ) {
    const foundBlog: BlogsTypes | null = await this.blogsService.getBlogById(
      blogId,
    );

    if (foundBlog) {
      const newPostsForBlog: PostsTypes<UserLikes> =
        await this.blogsService.createPostForSpecificBlog(
          body,
          blogId,
          foundBlog.name,
        );

      return newPostsForBlog;
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async getBlogById(@Param('id') id: any) {
    console.log(id);
    const BlogWithId: BlogsTypes | null = await this.blogsService.getBlogById(
      id,
    );

    if (BlogWithId) {
      return BlogWithId;
    } else {
      throw new NotFoundException();
    }
  }

  @HttpCode(204)
  @Put(':id')
  async updateBlogById(@Param('id') id: string, @Body() body: BlogViewType) {
    const isUpdated = await this.blogsService.updateBlog(body, id);

    if (!isUpdated) {
      throw new NotFoundException();
    }
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    const isDelete = await this.blogsService.deleteBlogById(id);

    if (!isDelete) {
      throw new NotFoundException();
    }
  }
}
