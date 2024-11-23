import { body, check } from "express-validator";
import {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
} from "../../constants/inputFieldsConstants.js";

const signupValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username must not be empty")
    .isString()
    .withMessage("username must be string of characters")
    .isLength({ min: USERNAME_LENGTH_MIN, max: USERNAME_LENGTH_MAX })
    .withMessage("username length must be between 3 and 25 characters")
    .matches(/^[A-Za-z0-9\-\_]+$/)
    .withMessage(
      "username accepts letters, numbers dash and underscore (no space)"
    )
    .escape(),

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

  check("confirmPassword")
    .trim()
    .custom((confirmPassword, { req }) => {
      const password = req.body.password;
      if (password !== confirmPassword) return false;
      return true;
    })
    .withMessage("confirm password not matching password")
    .escape(),
];

export default signupValidator;
