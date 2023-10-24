import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentService } from '../service/comment.service';
import { LikeStatusesEnum } from '../types/post.types';

@Controller('comments')
export class CommentController {
  constructor(protected commentService: CommentService) {}

  @HttpCode(204)
  @Put(':commentId/like-status')
  async likeAndDislikeOperation(
    @Param('commentId') commentId: string,
    @Body() likeStatus: LikeStatusesEnum,
    @Headers('authorization') userId: string,
  ) {
    const searchComment = await this.getCommentById(commentId);
    if (!searchComment) {
      throw new NotFoundException();
    }
    await this.commentService.likeAndDislikeOperation(
      commentId,
      likeStatus,
      userId,
    );
  }

  @HttpCode(204)
  @Put(':commentId')
  async updateCommentById(@Param() commentId: string, @Body() content: string) {
    const searchComment = await this.getCommentById(commentId);
    if (!searchComment) {
      throw new NotFoundException();
    }
    await this.commentService.updateCommentById(commentId, content);
  }

  @HttpCode(204)
  @Delete(':commentId')
  async deleteCommentById(@Param('commentId') commentId: string) {
    const searchComment = await this.commentService.getCommentById(commentId);
    if (!searchComment) {
      throw new NotFoundException();
    }
    await this.commentService.deleteCommentById(commentId);
  }

  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    return this.commentService.getCommentById(commentId);
  }
}
