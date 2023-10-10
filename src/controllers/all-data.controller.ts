import { Controller, Delete, HttpCode } from '@nestjs/common';
import { AllDataRepositories } from '../repositories/all-data.repositories';

@Controller('testing')
export class AllDataController {
  constructor(protected allDataRepositories: AllDataRepositories) {}

  @HttpCode(204)
  @Delete('all-data')
  deleteAllData() {
    return this.allDataRepositories.deleteAllData();
  }
}
