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

export enum ISalaryCoefficientTransformType {
  public = 'public',
  private = 'private',
}

@Table({
  timestamps: true,
})
export class SalaryCoefficients extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @AllowNull(false)
  @Column
  coefficient!: number;

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

  transform(type: ISalaryCoefficientTransformType = ISalaryCoefficientTransformType.public): ISalaryCoefficients {
    const coefficients: ISalaryCoefficients = {
      id: this.id,
      name: this.name,
      coefficient: this.coefficient,
    };

    if ([ISalaryCoefficientTransformType.private].includes(type)) {
      coefficients.createdAt = this.createdAt.toISOString();
      coefficients.updatedAt = this.updatedAt.toISOString();
    }

    return coefficients;
  }

  static updateSalaryCoefficient(id: string, coefficient: { startAt?: Date } = {}): Promise<boolean> {
    return this.update(
      {
        ...coefficient,
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

export interface ISalaryCoefficients {
  id: string;
  name: string;
  coefficient: number;
  createdAt?: string;
  updatedAt?: string;
}
