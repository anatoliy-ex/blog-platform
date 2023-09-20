import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from '../service/comment.service';

@Controller('comments')
export class CommentController {
  constructor(protected commentService: CommentService) {}

  @Get(':id')
  getCommentById(@Param('id') commentId: string) {
    return this.commentService.getUserById(commentId);
  }
}
