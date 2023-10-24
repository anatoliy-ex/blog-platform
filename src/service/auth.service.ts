import { AuthUsersRepositories } from '../repositories/auth.repositories';
import { JwtTokenService } from './jwt.token.service';
import { Injectable } from '@nestjs/common';
import { LoginType } from '../types/auth.user.types';
import { RefreshTokenSessionsTypes } from '../types/refresh.token.sessions.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshTokenSessionDbSchema,
  RefreshTokenSessionDocument,
} from '../schema/refresh.token.session.Schema';

@Injectable()
export class AuthUsersService {
  constructor(
    protected authUsersRepositories: AuthUsersRepositories,
    protected jwtTokenService: JwtTokenService,
    @InjectModel(RefreshTokenSessionDbSchema.name)
    private refreshTokenSessionModel: Model<RefreshTokenSessionDocument>,
  ) {}

  //login users
  async loginUser(
    authUser: LoginType,
    userIp: string,
    deviceId: string,
    deviceName: string,
  ) {
    const userId = await this.authUsersRepositories.loginUser(authUser);

    if (userId) {
      const newAccessTokes = await this.jwtTokenService.createAccessTokes(
        userId,
      );
      const newRefreshToken = await this.jwtTokenService.createRefreshToken(
        userId,
        deviceId,
      );
      const lastActiveDate =
        await this.jwtTokenService.getLastActiveDateFromToken(newRefreshToken);
      console.log(newRefreshToken);

      const newSessions: {
        ip: string;
        lastActiveDate: string;
        title: string;
        deviceId: string;
        userId: string | boolean;
      } = {
        deviceId: deviceId,
        ip: userIp, //device IP(user IP)
        title: deviceName, //device name
        lastActiveDate,
        userId: userId,
      };

      await this.refreshTokenSessionModel.insertMany([newSessions]);
      return { refreshToken: newRefreshToken, accessTokes: newAccessTokes };
    } else {
      return false;
    }
  }

  async GenerateRefreshAndAccessToken(
    userId: string,
    deviceId: string,
    sessions: any,
    deviceIp: string,
  ) {
    const newAccessTokes = await this.jwtTokenService.createAccessTokes(userId);
    const newRefreshToken = await this.jwtTokenService.createRefreshToken(
      userId,
      deviceId,
    );
    const lastActiveDate =
      await this.jwtTokenService.getLastActiveDateFromToken(newRefreshToken);

    const updateSessions: RefreshTokenSessionsTypes = {
      deviceId: sessions.deviceId,
      ip: deviceIp, //device IP(user IP)
      title: sessions.title, //device name
      lastActiveDate,
      userId: userId,
    };
    await this.refreshTokenSessionModel.updateOne(
      { deviceId, userId },
      { $set: updateSessions },
    );
    return { refreshToken: newRefreshToken, accessTokes: newAccessTokes };
  }
}
