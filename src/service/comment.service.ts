import { Injectable } from '@nestjs/common';
import { CommentRepositories } from '../repositories/comment.repositories';
import { LikeStatusesEnum } from '../types/post.types';

@Injectable()
export class CommentService {
  constructor(protected commentRepositories: CommentRepositories) {}

  async likeAndDislikeOperation(
    commentId: string,
    likeStatus: LikeStatusesEnum,
    userId: string,
  ) {
    return await this.commentRepositories.likeAndDislikeOperation(
      commentId,
      likeStatus,
      userId,
    );
  }

  async updateCommentById(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    return await this.commentRepositories.updateCommentById(commentId, content);
  }

  async deleteCommentById(commentId: string) {
    return await this.commentRepositories.deleteCommentById(commentId);
  }

  async getCommentById(commentId: string) {
    return this.commentRepositories.getUserById(commentId);
  }
}
