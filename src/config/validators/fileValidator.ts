import { check } from "express-validator";

const fileValidator = [
  check("file")
    .custom((value, { req }) => {
      if (req.file.mimetype === "application/pdf") {
        return true; // non falsy value = valid data
      } else {
        return false;
      }
    })
    .withMessage("Only PDF documents are allowed")
    .custom((value, { req }) => {
      if (req.file.size < 1_048_576) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("File size is to big, maximum size is (1MB)"),
];

export default fileValidator;
