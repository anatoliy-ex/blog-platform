import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

describe('integration tests for user-service', () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  describe('create User', () => {
    it('should return', async () => {
      expect(5).toBe(5);
    });
  });
});
