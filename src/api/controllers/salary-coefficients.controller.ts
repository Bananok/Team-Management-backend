import { NextFunction, Request, Response } from 'express';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import APIError, { ErrorCode } from 'utils/APIError';
import { ISalaryCoefficientTransformType, SalaryCoefficients } from 'models/salary-coefficients.model';

export const addCoefficient = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { name } = req.body as {
      name: string;
    };

    const coefficientSameName = await SalaryCoefficients.findOne({
      where: {
        name,
      },
    });

    if (coefficientSameName) {
      return next(new APIError(ErrorCode.CHECKIN_ALREADY_EXISTS));
    }

    const addedCoefficient = await SalaryCoefficients.create(req.body);

    return apiJson({
      req,
      res,
      data: addedCoefficient.transform(ISalaryCoefficientTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const getCoefficients = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const coefficients = await SalaryCoefficients.findAll();

    return apiJson({
      req,
      res,
      data: coefficients.map((c) => c.transform(ISalaryCoefficientTransformType.public)),
    });
  } catch (e) {
    return next(e);
  }
};
