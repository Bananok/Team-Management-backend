import '../jest-helper';

// Models
import { IUser, IUserTransformType } from 'models/user.model';

// Types
import { UserRole, PersonStatus } from 'interfaces/user';

export interface IUserInputResponseGenerator {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  workDays: number[];
  hasPlanner?: boolean;
  role?: UserRole;
  defaultRate?: number;
  colour?: string;
  status: PersonStatus;
  defaultLevel: string;
  defaultLegalStatus: string;
  defaultWeeklyCapacity: number;
  defaultExpertize: string;
  name?: string;
  email?: string | null;
}

export default (
  {
    id = expect.any(String),
    createdAt = expect.any(String),
    updatedAt = expect.any(String),
    phone = expect.any(String),
    workDays = expect.toBeArrayOrNull(Number),
    hasPlanner = expect.any(Boolean),
    role = expect.any(String),
    name = expect.any(String),
    email = expect.toBeTypeOrNull(String),
    defaultRate = expect.any(Number),
    colour = expect.any(String),
    status = expect.any(String),
    defaultLevel = expect.any(String),
    defaultLegalStatus = expect.any(String),
    defaultWeeklyCapacity = expect.any(String),
    defaultExpertize = expect.any(String),
  }: IUserInputResponseGenerator,
  type: IUserTransformType = IUserTransformType.public
): IUser => {
  const resultUser: IUser = {
    id,
    name,
    defaultRate,
    phone,
    workDays,
    hasPlanner,
    colour,
    status,
    defaultLevel,
    defaultLegalStatus,
    defaultWeeklyCapacity,
    defaultExpertize,
  };

  if ([IUserTransformType.private].includes(type)) {
    resultUser.createdAt = createdAt;
    resultUser.updatedAt = updatedAt;
    resultUser.role = role as UserRole;
    resultUser.email = email || undefined;
  }

  return resultUser;
};
