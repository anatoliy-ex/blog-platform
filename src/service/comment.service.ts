import { Injectable } from '@nestjs/common';
import { CommentRepositories } from '../repositories/comment.repositories';

@Injectable()
export class CommentService {
  constructor(protected commentRepositories: CommentRepositories) {}
  getUserById(commentId: string) {
    return this.commentRepositories.getUserById(commentId);
  }
}
