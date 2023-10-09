import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { UsersRepositories } from './repositories/user.repositories';
import { UsersService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
//import { BlogsController } from './controllers/blog.controller';
import { CommentController } from './controllers/comment.controller';
//import { PostsController } from './controllers/post.controller';
//import { PostsRepositories } from './repositories/post.repositories';
//import { PostsService } from './service/post.service';
import { CommentRepositories } from './repositories/comment.repositories';
import { CommentService } from './service/comment.service';
//import { BlogsRepositories } from './repositories/blog.repositories';
//import { BlogsService } from './service/blog.service';
import { UserDbSchema, UserSchema } from './shame/user.Schema';
import { CommentOut, CommentSchema } from './shame/comment.Schema';
import { settings } from '../.env/settings';
import { TestingRepositories } from './repositories/testing.repositories';
import { AllDataRepositories } from './repositories/all-data.repositories';
import { AllDataController } from './controllers/all-data.controller';
import { BlogDbSchema, BlogSchema } from './shame/blog.Schema';
import { BlogsRepositories } from './repositories/blog.repositories';
import { BlogsService } from './service/blog.service';
import { BlogsController } from './controllers/blog.controller';
import { PostsController } from './controllers/post.controller';
import { PostsRepositories } from './repositories/post.repositories';
import { PostsService } from './service/post.service';
import { PostDbSchema, PostSchema } from './shame/post.Schema';
import {
  LikeStatusForPostDbSchema,
  LikeStatusForPostSchema,
} from './shame/like.status.for.post.Schema';
import {
  LikeStatusForCommentDbSchema,
  LikeStatusForCommentSchema,
} from './shame/like.status.for.comment.Schema';

@Module({
  imports: [
    MongooseModule.forRoot(settings.MONGO_URI),
    MongooseModule.forFeature([
      { name: UserDbSchema.name, schema: UserSchema },
    ]),
    MongooseModule.forFeature([
      { name: CommentOut.name, schema: CommentSchema },
    ]),
    MongooseModule.forFeature([
      { name: BlogDbSchema.name, schema: BlogSchema },
    ]),
    MongooseModule.forFeature([
      { name: PostDbSchema.name, schema: PostSchema },
    ]),
    MongooseModule.forFeature([
      { name: LikeStatusForPostDbSchema.name, schema: LikeStatusForPostSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: LikeStatusForCommentDbSchema.name,
        schema: LikeStatusForCommentSchema,
      },
    ]),
  ],
  controllers: [
    AppController,
    UserController,
    BlogsController,
    CommentController,
    PostsController,
    AllDataController,
  ],
  providers: [
    AppService,
    UsersRepositories,
    UsersService,
    PostsRepositories,
    PostsService,
    CommentRepositories,
    CommentService,
    BlogsRepositories,
    BlogsService,
    TestingRepositories,
    AllDataRepositories,
  ],
})
export class AppModule {}
