import { IsEmail, Length } from 'class-validator';

export type UserConfirmTypes = {
  id: string;
  login: string;
  hash: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
};

export type UserIsNotConfirmTypes = {
  id: string;
  login: string;
  hash: string;
  email: string;
  createdAt: string;
  isConfirm: boolean;
  confirmationCode: string;
  expirationDate: number | Date;
};

export class InputUserType {
  @Length(5)
  login: string;
  @Length(6)
  password: string;
  @IsEmail()
  email: string;
}

export type UserViewType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type exceptionObjectType = {
  message: string;
  field: string;
};
