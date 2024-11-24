import { body } from "express-validator";

const loginValidator = [
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

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password must not be empty")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/)
    .withMessage(
      "password must be be minimum of 8 character and including uppercase letter, lowercase letter, number and special character @$!%*?&"
    )
    .escape(),
];

export default loginValidator;
