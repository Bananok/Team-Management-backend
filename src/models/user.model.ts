import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  Length,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

// Types
import { UserRole, PersonStatus } from 'interfaces/user';

// Configs
import configVars from 'config/vars';
import { Currency } from 'interfaces/currency';

export enum IUserTransformType {
  public = 'public',
  private = 'private',
}

@Table({
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

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

  @AllowNull(false)
  @Unique
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @AllowNull(false)
  @Length({
    min: 3,
    max: 48,
  })
  @Column(DataType.STRING(48))
  name!: string;

  @AllowNull(true)
  @Length({
    min: 6,
    max: 11,
  })
  @Column
  phone: string;

  @AllowNull(false)
  @Default(false)
  @Column
  hasPlanner!: boolean;

  @AllowNull(false)
  @Default(UserRole.USER)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role!: UserRole;

  @AllowNull(true)
  @Column
  defaultRate!: number;

  @AllowNull(false)
  @Default(PersonStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(PersonStatus)))
  status!: PersonStatus;

  @AllowNull(true)
  @Column
  defaultLevel!: string;

  @AllowNull(false)
  @Default(Currency.RUB)
  @Column(DataType.ENUM(...Object.values(Currency)))
  currency!: Currency;

  @AllowNull(true)
  @Column
  defaultLegalStatus!: string;

  @AllowNull(true)
  @Column
  defaultWeeklyCapacity!: number;

  @AllowNull(true)
  @Column
  defaultExpertize!: string;

  @Default([0, 1, 2, 3, 4])
  @Column(DataType.ARRAY(DataType.INTEGER))
  workDays: number[];

  @AllowNull(true)
  @Column
  colour!: string;

  @BeforeCreate
  @BeforeUpdate
  static generateHash(instance: User): void {
    if (instance.password?.trim().length) {
      // modifying password => encrypt it:
      const rounds = configVars.env === 'test' ? 1 : 10;
      // eslint-disable-next-line no-param-reassign
      instance.password = bcrypt.hashSync(instance.password, rounds);
    }
  }

  transform(type: IUserTransformType = IUserTransformType.public): IUser {
    const profile: IUser = {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      hasPlanner: this.hasPlanner,
      role: this.role,
      defaultRate: this.defaultRate,
      currency: this.currency,
      status: this.status,
      defaultLevel: this.defaultLevel,
      defaultLegalStatus: this.defaultLegalStatus,
      defaultWeeklyCapacity: this.defaultWeeklyCapacity,
      defaultExpertize: this.defaultExpertize,
      colour: this.colour,
      workDays: this.workDays,
    };

    if ([IUserTransformType.private].includes(type)) {
      profile.createdAt = this.createdAt.toISOString();
      profile.updatedAt = this.updatedAt.toISOString();
    }

    return profile;
  }

  static updateProfile(userId: string, profile: { firstName?: string; lastName?: string } = {}): Promise<boolean> {
    return this.update(
      {
        ...profile,
      },
      {
        where: {
          id: userId,
        },
        returning: false,
      }
    ).then(([count]) => count > 0);
  }

  static findUserByPk(id: string, options: { withoutScopes?: boolean } = {}): Promise<User | null> {
    const { withoutScopes = false } = options;

    return (withoutScopes ? this.unscoped() : this).findByPk(id);
  }

  static findUserByEmail(email: string, options: { withoutScopes?: boolean } = {}): Promise<User | null> {
    const { withoutScopes = false } = options;

    return (withoutScopes ? this.unscoped() : this).findOne({
      where: {
        email,
      },
    });
  }
}

export interface IUser {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  hasPlanner?: boolean;
  name: string;
  defaultRate: number;
  currency?: Currency;
  colour: string;
  status: PersonStatus;
  defaultLevel: string;
  defaultLegalStatus: string;
  defaultWeeklyCapacity: number;
  defaultExpertize: string;
  workDays: number[];
}
