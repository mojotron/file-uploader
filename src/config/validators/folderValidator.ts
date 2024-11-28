import { body } from "express-validator";
import {
  FOLDER_LENGTH_MIN,
  FOLDER_LENGTH_MAX,
  FOLDER_DESCRIPTION_LENGTH_MIN,
  FOLDER_DESCRIPTION_LENGTH_MAX,
} from "../../constants/inputFieldsConstants.js";

const folderValidator = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage("folder name must not be empty")
    .isString()
    .withMessage("folder name must be string of characters")
    .isLength({ min: FOLDER_LENGTH_MIN, max: FOLDER_LENGTH_MAX })
    .withMessage(
      `folder name length must be between ${FOLDER_LENGTH_MIN} and ${FOLDER_LENGTH_MAX} characters`
    )
    .matches(/^[A-Za-z0-9\-\_]+$/)
    .withMessage(
      "folder name accepts letters, numbers dash and underscore (no space)"
    )
    .escape(),

  body("folderDescription")
    .trim()
    .notEmpty()
    .withMessage("folder description must not be empty")
    .isString()
    .withMessage("folder description must be string of characters")
    .isLength({
      min: FOLDER_DESCRIPTION_LENGTH_MIN,
      max: FOLDER_DESCRIPTION_LENGTH_MAX,
    })
    .withMessage(
      `folder description length must be between ${FOLDER_DESCRIPTION_LENGTH_MIN} and ${FOLDER_DESCRIPTION_LENGTH_MAX} characters`
    )
    .matches(/^[A-Za-z0-9\-\_]+$/)
    .withMessage(
      "folder description accepts letters, numbers dash and underscore (no space)"
    )
    .escape(),
];

export default folderValidator;
