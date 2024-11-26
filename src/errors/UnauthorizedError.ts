import { StatusCodes } from "http-status-codes";
import { CustomError } from "./index.js";

class UnauthorizedError extends CustomError {
  statusCode: number;

  constructor(
    message: string = "Current user has no rights to se requested resources"
  ) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
