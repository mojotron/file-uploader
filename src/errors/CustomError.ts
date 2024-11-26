import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
  statusCode: number;

  constructor(
    message: string = `We encountered error, please try again later!`
  ) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export default CustomError;
