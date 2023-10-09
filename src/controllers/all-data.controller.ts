import { Controller, Delete, HttpCode } from '@nestjs/common';
import { AllDataRepositories } from '../repositories/all-data.repositories';

@Controller('all-data')
export class AllDataController {
  constructor(protected allDataRepositories: AllDataRepositories) {}

  @HttpCode(204)
  @Delete()
  deleteAllData() {
    return this.allDataRepositories.deleteAllData();
  }
}
