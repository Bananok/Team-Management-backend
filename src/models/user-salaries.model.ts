import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
// Types

export enum IUserSalariesTransformType {
  public = 'public',
  private = 'private',
}

export class UserSalaries extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  userId!: string;

  @BelongsTo(() => User)
  user?: User;

  @AllowNull(false)
  @Column
  salary!: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  startAt!: Date;

  @AllowNull(false)
  @CreatedAt
  @Default(DataType.NOW)
  @Column
  createdAt!: Date;

  @AllowNull(false)
  @UpdatedAt
  @Default(DataType.NOW)
  @Column
  updatedAt!: Date;

  transform(type: IUserSalariesTransformType = IUserSalariesTransformType.public): IUserSalaries {
    const salaries: IUserSalaries = {
      id: this.id,
      userId: this.userId,
      salary: this.salary,
      startAt: this.startAt.toISOString(),
    };

    if ([IUserSalariesTransformType.private].includes(type)) {
      salaries.createdAt = this.createdAt.toISOString();
      salaries.updatedAt = this.updatedAt.toISOString();
    }

    return salaries;
  }

  static updateUserSalaries(id: string, profile: { startAt?: Date } = {}): Promise<boolean> {
    return this.update(
      {
        ...profile,
      },
      {
        where: {
          id,
        },
        returning: false,
      }
    ).then(([count]) => count > 0);
  }
}

export interface IUserSalaries {
  id: string;
  userId: string;
  salary: number;
  startAt: string;
  createdAt?: string;
  updatedAt?: string;
}
