import { Request, Response } from "express";
import * as yup from "yup";

import { getNextMove } from "./engine";

const gameSchema = yup
  .object()
  .required()
  .shape({
    fen: yup.string().required(),
  })
  .noUnknown();

export const gameHandler = async (
  request: Request,
  response: Response
): Promise<Response<unknown>> => {
  try {
    let game;

    try {
      game = await gameSchema.validate(request.body);
    } catch (err) {
      return response.sendStatus(400);
    }

    const move = await getNextMove(game.fen);

    return response.json(move);
  } catch (err) {
    console.error(err);

    return response.sendStatus(500);
  }
};
