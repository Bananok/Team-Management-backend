import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  Table,
  PrimaryKey,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  DeletedAt,
} from 'sequelize-typescript';
import { Projects } from './projects.model';
// Types

export enum IExpertizesTransformType {
  public = 'public',
  private = 'private',
}

@Table({
  paranoid: true,
})
export class Expertizes extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

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
  @Column
  expertize!: string;

  @AllowNull(false)
  @Column
  rate!: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  startAt!: Date;

  @AllowNull(true)
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

  @AllowNull(true)
  @DeletedAt
  @Column
  deletedAt!: Date;

  transform(type: IExpertizesTransformType = IExpertizesTransformType.public): IExpertizes {
    const expertizes: IExpertizes = {
      id: this.id,
      projectId: this.projectId,
      rate: this.rate,
      expertize: this.expertize,
      startAt: this.startAt.toISOString(),
    };

    if ([IExpertizesTransformType.private].includes(type)) {
      expertizes.createdAt = this.createdAt.toISOString();
      expertizes.updatedAt = this.updatedAt.toISOString();
    }

    return expertizes;
  }

  static updateExpertizes(id: string, profile: { endAt?: Date } = {}): Promise<boolean> {
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

export interface IExpertizes {
  id: string;
  projectId: string;
  rate: number;
  expertize: string;
  startAt: string;
  createdAt?: string;
  updatedAt?: string;
}
