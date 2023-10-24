import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDbSchema, BlogDocument } from '../schema/blog.Schema';
import { Model } from 'mongoose';
import { PostDbSchema, PostDocument } from '../schema/post.Schema';
import {
  LikeStatusForPostDbSchema,
  LikeStatusForPostDocument,
} from '../schema/like.status.for.post.Schema';
import { UserDbSchema, UserDocument } from '../schema/user.Schema';
import { CommentDocument, CommentOut } from '../schema/comment.Schema';
import {
  LikeStatusForCommentDbSchema,
  LikeStatusForCommentDocument,
} from '../schema/like.status.for.comment.Schema';
import { JwtTokenService } from '../service/jwt.token.service';
import { LoginType } from '../types/auth.user.types';
import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import nodemailer from 'nodemailer';
import add from 'date-fns/add';
import { PasswordRecoveryDocument } from '../schema/password.recovery.Schema';
import {
  InputUserType,
  UserConfirmTypes,
  UserIsNotConfirmTypes,
} from '../types/user.confirm.types';
import {
  UserNotConfirmationDbSchema,
  UserNotConfirmationDocument,
} from '../schema/user.not.confirmation.Schema';

@Injectable()
export class AuthUsersRepositories {
  private jwtTokenService: JwtTokenService;

  constructor(,
  ) {}
  //login users
  async loginUser(authUser: LoginType) {
    const filter = {
      $or: [
        { login: { $regex: authUser.loginOrEmail, $options: 'i' } },
        { email: { $regex: authUser.loginOrEmail, $options: 'i' } },
      ],
    };

    const user: UserConfirmTypes = await this.userModel.findOne(filter);

    if (user) {
      const isLogin: boolean = await bcrypt.compare(
        authUser.password,
        user.hash,
      );

      if (isLogin) {
        return user.id;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ////password recovery via email
  async recoveryPasswordWithSendEmail(email: string): Promise<boolean> {
    const date = new Date();
    const recoveryCode = uuid4();
    await this.passwordRecoveryModel.create({
      confirmCode: recoveryCode,
      email: email,
      dateAt: date,
    });
    console.log(email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'incubator.blogs.platform@gmail.com', // generated ethereal user
        pass: 'snfsapqqywlznyjj', // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: 'IT-INCUBATOR Blogs Platform <incubator.blogs.platform@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`,
    });

    return true;
  }

  //confirm new password with recovery code
  async confirmNewPasswordWithCode(
    newPassword: string,
    userConfirmCode: string,
  ): Promise<boolean> {
    try {
      const user: UserConfirmTypes = await this.passwordRecoveryModel.findOne({
        confirmCode: userConfirmCode,
      });
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.userModel.updateOne(
        { email: user.email },
        { hash: passwordHash },
      );
      await this.passwordRecoveryModel.deleteOne({
        confirmCode: userConfirmCode,
      });
      return true;
    } catch {
      return false;
    }
  }

  //confirm registration-2
  async confirmEmailByUser(code: string): Promise<boolean> {
    const confirmationUser: UserIsNotConfirmTypes =
      await this.userNotConfirmationModel.findOne({
        confirmationCode: code,
      });

    if (confirmationUser && confirmationUser.expirationDate > new Date()) {
      const updateUser: UserConfirmTypes = {
        id: confirmationUser.id,
        login: confirmationUser.login,
        email: confirmationUser.email,
        hash: confirmationUser.hash,
        createdAt: confirmationUser.createdAt,
        isConfirm: true,
      };
      const filter = { confirmationCode: code };

      await this.userNotConfirmationModel.deleteOne(filter);
      await this.userModel.create(updateUser);
      return true;
    } else {
      return false;
    }
  }

  //first registration in system => send to email code for verification-1
  async firstRegistrationInSystem(user: InputUserType): Promise<boolean> {
    const filter = {
      $or: [{ login: user.login }, { email: user.email }],
    };

    const checkUserInSystem: UserConfirmTypes = await this.userModel.find(
      filter,
    );
    const checkUserIsNotConfirmInSystem: UserIsNotConfirmTypes =
      await this.userNotConfirmationModel.find(filter);

    if (!checkUserInSystem) {
      console.log(checkUserInSystem);
      return false;
    } else if (!checkUserIsNotConfirmInSystem) {
      console.log(checkUserIsNotConfirmInSystem + '2');
      return false;
    } else {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const now = new Date();
      const code = uuid4();
      console.log(code);

      const newUser: UserIsNotConfirmTypes = {
        id: `${Date.now()}`,
        login: user.login,
        email: user.email,
        hash: passwordHash,
        createdAt: now.toISOString(),
        isConfirm: false,
        confirmationCode: code,
        expirationDate: add(new Date(), { hours: 1 }),
      };

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'incubator.blogs.platform@gmail.com', // generated ethereal user
          pass: 'snfsapqqywlznyjj', // generated ethereal password
        },
      });

      const info: any = await transporter.sendMail({
        from: 'IT-INCUBATOR Blogs Platform <incubator.blogs.platform@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${newUser.confirmationCode}'>complete registration</a>
      </p>`,
      });

      await this.userNotConfirmationModel.insertMany([newUser]);
      return true;
    }
  }

  //registration in system-3
  async registrationWithSendingEmail(email: string) {
    const user: UserIsNotConfirmTypes =
      await this.userNotConfirmationModel.findOne({ email: email });

    if (user && !user.isConfirm) {
      const newCode = uuid4();
      await this.userNotConfirmationModel.updateOne(
        { email: email },
        { $set: { confirmationCode: newCode } },
      );
      const updatedUser: UserIsNotConfirmTypes =
        await this.userNotConfirmationModel.findOne({
          email: email,
        });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'incubator.blogs.platform@gmail.com', // generated ethereal user
          pass: 'snfsapqqywlznyjj', // generated ethereal password
        },
      });

      const info: any = await transporter.sendMail({
        from: 'IT-INCUBATOR <incubator.blogs.platform@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `<h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${updatedUser.confirmationCode}'>complete registration</a>
      </p>`,
      });

      return true;
    } else {
      return false;
    }
  }

  //get information about user
  async getUserWithAccessToken(token: string) {
    const userId = await this.jwtTokenService.getUserIdByToken(token);

    if (userId != null) {
      return this.userModel.findOne({ id: userId });
    } else {
      return null;
    }
  }

  //get user id by login or email
  async getUserIdByLoginOrEmail(authUser: LoginType) {
    const filter = {
      $or: [
        { login: { $regex: authUser.loginOrEmail, $options: 'i' } },
        { email: { $regex: authUser.loginOrEmail, $options: 'i' } },
      ],
    };

    const user: UserConfirmTypes = await this.userModel.findOne(filter);

    if (user) {
      return user.id;
    } else {
      return false;
    }
  }
}
