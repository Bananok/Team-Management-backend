import { PersonStatus } from 'interfaces/user';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Projects } from './projects.model';

export enum IClientTransformType {
  public = 'public',
  private = 'private',
}

@Table({
  timestamps: true,
})
export class Clients extends Model {
  @PrimaryKey
  @ForeignKey(() => Projects)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @HasMany(() => Projects, { foreignKey: 'clientId' })
  projects: Projects;

  @AllowNull(false)
  @Column(DataType.STRING)
  director!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  contactPerson!: string;

  @AllowNull(false)
  @Default(PersonStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(PersonStatus)))
  status!: PersonStatus;

  @AllowNull(false)
  @Unique
  @Column
  email!: string;

  @AllowNull(false)
  @Column
  legalName!: string;

  @AllowNull(false)
  @Column
  legalTin!: string;

  @AllowNull(false)
  @Column
  legalOgrn!: string;

  @AllowNull(false)
  @Column
  legalKpp!: string;

  @AllowNull(false)
  @Column
  legalAddress!: string;

  @AllowNull(false)
  @Column
  postalAddress!: string;

  @AllowNull(true)
  @Column
  comment!: string;

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

  transform(type: IClientTransformType = IClientTransformType.public): IClient {
    const client: IClient = {
      id: this.id,
      director: this.director,
      contactPerson: this.contactPerson,
      status: this.status,
      email: this.email,
      legalName: this.legalName,
      legalTin: this.legalTin,
      legalOgrn: this.legalOgrn,
      legalKpp: this.legalKpp,
      legalAddress: this.legalAddress,
      postalAddress: this.postalAddress,
      comment: this.comment,
    };

    if ([IClientTransformType.private].includes(type)) {
      client.createdAt = this.createdAt.toISOString();
      client.updatedAt = this.updatedAt.toISOString();
    }

    return client;
  }

  static updateClients(
    id: string,
    profile: {
      director?: string;
      contactPerson?: string;
      status?: PersonStatus;
      email?: string;
      legalTin?: string;
      legalOgrn?: string;
      legalKpp?: string;
      legalAddress?: string;
      postalAddress?: string;
      comment?: string;
      legalName?: string;
    } = {}
  ): Promise<boolean> {
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

export interface IClient {
  id: string;
  director: string;
  status: PersonStatus;
  contactPerson: string;
  email: string;
  legalName: string;
  legalTin: string;
  legalOgrn: string;
  legalKpp: string;
  legalAddress: string;
  postalAddress: string;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
