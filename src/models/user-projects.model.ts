import { UserProjectsRole } from 'interfaces/user';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Projects } from './projects.model';
import { User } from './user.model';
// Types

export enum IUserProjectsTransformType {
  public = 'public',
  private = 'private',
}

@Table({
  timestamps: true,
  paranoid: true,
})
export class UserProjects extends Model {
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
  @ForeignKey(() => Projects)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  projectId!: string;

  @BelongsTo(() => Projects)
  project?: Projects;

  @AllowNull(false)
  @Default(UserProjectsRole.VENDOR)
  @Column(DataType.ENUM(...Object.values(UserProjectsRole)))
  role!: UserProjectsRole;

  @AllowNull(false)
  @Column
  rate!: number;

  @AllowNull(true)
  @Column
  dailyHours!: number;

  @AllowNull(true)
  @Column
  expertize!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  startAt!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endAt!: Date;

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

  transform(type: IUserProjectsTransformType = IUserProjectsTransformType.public): IUserProjects {
    const userProjects: IUserProjects = {
      id: this.id,
      userId: this.userId,
      projectId: this.projectId,
      role: this.role,
      rate: this.rate,
      expertize: this.expertize,
      dailyHours: this.dailyHours,
      startAt: this.startAt.toISOString(),
      endAt: this.endAt.toISOString(),
    };

    if ([IUserProjectsTransformType.private].includes(type)) {
      userProjects.createdAt = this.createdAt.toISOString();
      userProjects.updatedAt = this.updatedAt.toISOString();
    }

    return userProjects;
  }

  static updateUserProjects(
    userProjectsUserId: string,
    userProjectsProjectId: string,
    startAtRate: Date,
    endAtRate: Date,
    profile: { startAt?: Date; endAt?: Date } = {}
  ): Promise<boolean> {
    return this.update(
      {
        ...profile,
      },
      {
        where: {
          userId: userProjectsUserId,
          projectId: userProjectsProjectId,
          startAt: startAtRate,
          endAt: endAtRate,
        },
        returning: false,
      }
    ).then(([count]) => count > 0);
  }
}

export interface IUserProjects {
  id: string;
  userId: string;
  projectId: string;
  role?: UserProjectsRole;
  rate: number;
  expertize: string;
  dailyHours: number;
  startAt: string;
  endAt: string;
  createdAt?: string;
  updatedAt?: string;
}
