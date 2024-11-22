import { body } from "express-validator";
import {
  USERNAME_LENGTH_MIN,
  USERNAME_LENGTH_MAX,
} from "../../constants/inputFieldsConstants";

const signupValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username field must not be empty")
    .isString()
    .withMessage("username field must be string of characters")
    .isLength({ min: USERNAME_LENGTH_MIN, max: USERNAME_LENGTH_MAX })
    .withMessage("username field length must be between 3 and 25 characters")
    .matches(/^[A-Za-z0-9\-\_]+$/)
    .withMessage("username field accepts letters, numbers dash and underscore")
    .escape(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email field must not be empty")
    .isString()
    .withMessage("username field must be string of characters")
    .isEmail()
    .withMessage("email field must not be empty")
    .normalizeEmail()
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("password field must not be empty")
    .escape(),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("confirm password field must not be empty")
    .escape(),
];

export default signupValidator;
