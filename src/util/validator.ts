/** @format */

import { body, check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

class validator {
  objectValidationMW = (fieldName: any, type: string) => {
    const validationFunction = {
      boolean: this.booleanFieldValidationMW(fieldName),
    } as any;
    return validationFunction[type];
  };

  requiredFieldValidationMW = (fieldName: any) =>
    check(fieldName)
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage(`The ${fieldName} is required`);

  booleanFieldValidationMW = (fieldName: any) => {
    return check(fieldName)
      .isBoolean()
      .withMessage(`The ${fieldName} must be boolean`);
  };

  urlFieldValidationMW = (fieldName: any) =>
    check(fieldName)
      .isURL()
      .withMessage(
        `The ${fieldName} must be in URL format e.g. https://google.com`
      );

  arrayValidationMW = (fieldName: any, elementType: "string" | "number") =>
    check(fieldName)
      .isArray()
      .withMessage(`The ${fieldName} must be an array`)
      .custom((value: any) => {
        if (!Array.isArray(value)) {
          // If it's not an array, return false
          return false;
        }

        // Check each element's type
        return value.every((element: any) =>
          elementType === "string"
            ? typeof element === "string"
            : elementType === "number"
            ? typeof element === "number"
            : false
        );
      })
      .withMessage(
        `Each element in ${fieldName} must be of type ${elementType}`
      );

  // requiredFieldValidationInArrayMW = (fieldName: string) =>
  //   check(fieldName)
  //     .exists({ checkFalsy: true, checkNull: true })
  //     .withMessage(`In ${fieldName.replace(".*.", " ")} is required`);

  stringValidationMW = (fieldName: any) =>
    check(fieldName)
      .isString()
      .withMessage(`The ${fieldName} must be a string`);

  emailFieldValidationMW = (fieldName: string, optional = true) =>
    check(fieldName)
      .optional({ checkFalsy: optional })
      .isEmail()
      .withMessage("Invalid Email address");

  passwordFieldValidationMW = (fieldName: any, minLength: number) =>
    check(fieldName)
      .isLength({ min: minLength })
      .withMessage(
        `Password must be 8 characters long with the combination of uppercase , lowercase and numbers`
      )
      .matches("[0-9]")
      .withMessage(
        "Password must be 8 characters long with the combination of uppercase , lowercase and numbers"
      )
      .matches("[A-Z]")
      .withMessage(
        "Password must be 8 characters long with the combination of uppercase , lowercase and numbers"
      );

  validationResultMW = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let msg = errors.array();
      let error_msg = msg[0].msg;
      return res.status(400).json({ msg: error_msg });
    } else next();
  };

  // enumValidationMW(fieldName: string, allowedValues: string[]) {
  //   return (req: any, res: any, next: any) => {
  //     const value = req.body[fieldName];

  //     if (!allowedValues.includes(value)) {
  //       return res.status(422).json({
  //         errors: [
  //           {
  //             param: fieldName,
  //             msg: `Invalid value for ${fieldName}. it should be from: ${allowedValues}`,
  //           },
  //         ],
  //       });
  //     }

  //     next();
  //   };
  // }

  enumValidationMW(fieldName: string, allowedValues: string[]) {
    return (req: any, res: any, next: any) => {
      const values = Array.isArray(req.body[fieldName])
        ? req.body[fieldName]
        : [req.body[fieldName]];

      const invalidValues = values.filter(
        (value: string) => !allowedValues.includes(value)
      );

      if (invalidValues.length > 0) {
        return res.status(422).json({
          errors: [
            {
              param: fieldName,
              msg: `Invalid value(s) for ${fieldName}. They should be from: ${allowedValues}`,
            },
          ],
        });
      }

      next();
    };
  }

  enumSigunUpValidationMW(fieldName: string, allowedValues: string[]) {
    return (req: any, res: any, next: any) => {
      const value = req.body[fieldName];

      if (!allowedValues.includes(value) && value !== undefined) {
        return res.status(422).json({
          errors: [
            {
              param: fieldName,
              msg: `Invalid value for ${fieldName}. it should be from: ${allowedValues.join(
                ", "
              )}`,
            },
          ],
        });
      }

      next();
    };
  }

  numberValidationMW = (fieldName: any) =>
    check(fieldName)
      .isNumeric()
      .withMessage(`The ${fieldName} must be a number`);
}
export default new validator();
