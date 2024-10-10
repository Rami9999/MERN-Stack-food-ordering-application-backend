import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get("/search/:city",
    param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramter must be a valid string"),
    RestaurantController.searchRestaurants
);

router.get('/:restaurantId',
    param('restaurantId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId paramter must be a valid string"),
    RestaurantController.getRestaurant)

export default router;