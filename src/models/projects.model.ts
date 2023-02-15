import { ContractStatus, WorkStatus } from 'interfaces/project';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Currency } from 'interfaces/currency';

export enum IProjectsTransformType {
  public = 'public',
  private = 'private',
}

@Table({
  timestamps: true,
})
export class Projects extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  startAt!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  endAt!: Date;

  @AllowNull(false)
  @Default(false)
  @Column
  billableStatus!: boolean;

  @AllowNull(false)
  @Default(WorkStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(WorkStatus)))
  status!: WorkStatus;

  @AllowNull(false)
  @Default(ContractStatus.NA)
  @Column(DataType.ENUM(...Object.values(ContractStatus)))
  contractStatus!: ContractStatus;

  @AllowNull(false)
  @Default(Currency.RUB)
  @Column(DataType.ENUM(...Object.values(Currency)))
  currency!: Currency;

  @AllowNull(true)
  @Column
  archivedLink!: string;

  @AllowNull(true)
  @Column
  colour!: string;

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  clientId: string;

  @AllowNull(true)
  @Column
  manager: string;

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

  transform(type: IProjectsTransformType = IProjectsTransformType.public): IProjects {
    const projects: IProjects = {
      id: this.id,
      name: this.name,
      billableStatus: this.billableStatus,
      contractStatus: this.contractStatus,
      currency: this.currency,
      archivedLink: this.archivedLink,
      status: this.status,
      manager: this.manager,
      clientId: this.clientId,
      colour: this.colour,
    };

    if ([IProjectsTransformType.private].includes(type)) {
      projects.createdAt = this.createdAt.toISOString();
      projects.updatedAt = this.updatedAt.toISOString();
    }

    return projects;
  }

  static updateProject(
    projectId: string,
    profile: {
      name?: string;
      billableStatus?: boolean;
      startAt?: Date;
      endAt?: Date;
      contractStatus?: ContractStatus;
      status?: WorkStatus;
      currency?: Currency;
      archivedLink?: string;
      manager?: string;
      clientId?: string;
      colour?: string;
    } = {}
  ): Promise<boolean> {
    return this.update(
      {
        ...profile,
      },
      {
        where: {
          id: projectId,
        },
        returning: false,
      }
    ).then(([count]) => count > 0);
  }

  static updateArrayProject(
    projectId: [],
    profile: {
      name?: string;
      billableStatus?: boolean;
      startAt?: Date;
      endAt?: Date;
      contractStatus?: ContractStatus;
      status?: WorkStatus;
      currency?: Currency;
      archivedLink?: string;
      manager?: string;
      clientId?: string;
      colour?: string;
    } = {}
  ): Promise<boolean> {
    return this.update(
      {
        ...profile,
      },
      {
        where: {
          id: projectId,
        },
        returning: false,
      }
    ).then(([count]) => count > 0);
  }

  static updateProjects(
    projectsIds: string[],
    profile: {
      name?: string;
      billableStatus?: boolean;
      startAt?: Date;
      endAt?: Date;
      contractStatus?: ContractStatus;
      status?: WorkStatus;
      currency?: Currency;
      archivedLink?: string;
      manager?: string;
      clientId?: string;
      colour?: string;
    } = {}
  ): Promise<boolean> {
    return this.update(
      {
        ...profile,
      },
      {
        where: {
          id: projectsIds,
        },
        returning: false,
      }
    ).then(([count]) => count > 0);
  }

  static findProjectById(id: string, options: { withoutScopes?: boolean } = {}): Promise<Projects | null> {
    const { withoutScopes = false } = options;

    return (withoutScopes ? this.unscoped() : this).findOne({
      where: {
        id,
      },
    });
  }
}

export interface IProjects {
  id: string;
  name: string;
  billableStatus?: boolean;
  contractStatus: ContractStatus;
  currency?: Currency;
  archivedLink: string;
  status: WorkStatus;
  manager: string;
  clientId: string;
  colour: string;
  createdAt?: string;
  updatedAt?: string;
}
