import {body,validationResult} from "express-validator"

import {Request,Response,NextFunction} from "express"

const handleValidationErrors = async (req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    next();

}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name Must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 Must be a string"),
    body("city").isString().notEmpty().withMessage("city Must be a string"),
    body("country").isString().notEmpty().withMessage("country Must be a string"),
    handleValidationErrors,
]