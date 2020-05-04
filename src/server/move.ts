import { Request, Response } from "express";
import * as yup from "yup";

import { getNextMove, parseHistory } from "../chess";

const historySchema = yup
  .array(
    yup
      .object({
        from: yup.string().required(),
        to: yup.string().required(),
      })
      .required()
  )
  .required();

const moveHandler = async (request: Request, response: Response) => {
  try {
    let history;
    try {
      history = await historySchema.validate(request.body?.history);
    } catch (err) {
      return response.sendStatus(400);
    }

    return response.json(await getNextMove(parseHistory(history)));
  } catch (err) {
    return response.sendStatus(500);
  }
};

export default moveHandler;
