import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const isDraftValidations = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.body.is_draft === 'true' || req.body.is_draft === true) {
                return next();
            }

            for (let validation of validations) {
                if (Array.isArray(validation)) {
                    for (let v of validation) {
                        if (typeof v.run === 'function') {
                            await v.run(req);
                        }
                    }
                } else if (typeof validation.run === 'function') {
                    await validation.run(req);
                }
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                let msg = errors.array();
                let error_msg = msg[0].msg;
                console.log("Validation error", error_msg);
                return res.status(400).json({ msg: error_msg });
            }

            next();
        } catch (error) {
            console.error("Error in validation middleware", error);
            next(error);
        }
    };
};

export { isDraftValidations };
