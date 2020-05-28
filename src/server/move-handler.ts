import { Request, Response } from "express";
import * as yup from "yup";

import { getNextMove, parseHistory } from "../chess";

const payloadSchema = yup
  .object()
  .required()
  .shape({
    history: yup
      .array(
        yup
          .object({
            from: yup.string().required(),
            to: yup.string().required(),
          })
          .required()
      )
      .required(),
    moveTime: yup.number().required(),
  })
  .noUnknown();

const moveHandler = async (request: Request, response: Response) => {
  try {
    let payload;
    try {
      payload = await payloadSchema.validate(request.body);
    } catch (err) {
      return response.sendStatus(400);
    }

    const nextMove = await getNextMove(
      payload.moveTime,
      parseHistory(payload.history)
    );

    return response.json(nextMove);
  } catch (err) {
    return response.sendStatus(500);
  }
};

export default moveHandler;
