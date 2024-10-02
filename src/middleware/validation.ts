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

export const validateMyRestaurantRequest = [
    body("restaurantName").isString().notEmpty().withMessage("Restaurant Name Must be a string"),
    body("city").isString().notEmpty().withMessage("city Must be a string"),
    body("country").isString().notEmpty().withMessage("country Must be a string"),
    body("deliveryPrice").isFloat({min:0}).withMessage("Delivery price must be a positive number"),
    body("estimatedDeliveryTime").isInt({min:0}).withMessage("Estimated Delivery time must be a positive number"),
    body("cuisines").isArray().withMessage("cuisines must be an array").not().isEmpty().withMessage("cuisines array cannot be empty"),
    body("menuItems").isArray().withMessage("Menu Items must be an array"),
    body("menuItems.*.name").isString().notEmpty().withMessage("Menu Item name is required"),
    body("menuItems.*.price").isFloat({min:0}).withMessage("Menu Item price is required and must be a positive number"),
    handleValidationErrors,
]