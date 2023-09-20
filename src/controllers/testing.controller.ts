import { Controller, Delete } from '@nestjs/common';
import { TestingRepositories } from '../repositories/testing.repositories';

@Controller('testing')
export class TestingController {
  constructor(protected testingRepositories: TestingRepositories) {}

  @Delete('all-data')
  clearAllDataBase() {
    return 0;
  }
}
