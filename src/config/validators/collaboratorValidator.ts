import { body } from "express-validator";

const collaboratorValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email must not be empty")
    .isString()
    .withMessage("username must be string of characters")
    .isEmail()
    .withMessage("email format is invalid")
    .normalizeEmail()
    .escape(),
];

export default collaboratorValidator;
