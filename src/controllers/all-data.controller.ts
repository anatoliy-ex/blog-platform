import { Controller, Delete } from '@nestjs/common';
import { AllDataRepositories } from '../repositories/all-data.repositories';

@Controller('all-data')
export class AllDataController {
  constructor(protected allDataRepositories: AllDataRepositories) {}

  @Delete()
  deleteAllData() {
    return this.allDataRepositories.deleteAllData();
  }
}
