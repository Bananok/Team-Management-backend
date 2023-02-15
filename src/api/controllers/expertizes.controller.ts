import { NextFunction, Request, Response } from 'express';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import APIError, { ErrorCode } from 'utils/APIError';
import { Expertizes, IExpertizesTransformType } from 'models/expertizes.model';
import { Op } from 'sequelize';

export const addExpertize = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { expertize, projectId } = req.body as {
      expertize: string;
      projectId: string;
    };

    const expertizeSameName = await Expertizes.findOne({
      where: {
        endAt: null,
        expertize,
        projectId,
      },
    });

    if (expertizeSameName) {
      await Expertizes.updateExpertizes(expertizeSameName.id, { endAt: req.body.startAt });
    }

    const addedExpertize = await Expertizes.create(req.body);

    return apiJson({
      req,
      res,
      data: addedExpertize.transform(IExpertizesTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const getExpertizes = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { projectId } = req.body as {
      projectId: string;
    };

    const expertizes = await Expertizes.findAll({
      where: {
        projectId,
        startAt: { [Op.lt]: new Date() },
        endAt: {
          [Op.or]: {
            [Op.gte]: new Date(),
            [Op.eq]: null,
          },
        },
      },
    });

    if (!expertizes) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    return apiJson({
      req,
      res,
      data: expertizes.map((item) => {
        return item.transform(IExpertizesTransformType.public);
      }),
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteExpertize = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { id } = req.body as {
      id: string;
    };

    const expertize = await Expertizes.findOne({
      where: {
        id,
      },
      paranoid: false,
    });

    if (!expertize) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    await Expertizes.destroy({
      where: {
        id,
      },
    });

    return apiJson({
      req,
      res,
      data: 'deleted',
    });
  } catch (e) {
    return next(e);
  }
};
