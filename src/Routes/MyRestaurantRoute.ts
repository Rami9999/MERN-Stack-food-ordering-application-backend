import express from "express"
import MyRestaurantController from "../controllers/MyRestaurantController"
import { jwtCheck, jwtParse } from "../middleware/auth";
import multer from "multer";
import { validateMyRestaurantRequest } from "../middleware/validation";
import RestaurantController from "../controllers/RestaurantController";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage:storage,
    limits: {
        fileSize: 5*1024*1024, //5mb
    }
})
router.post('/',upload.single("imageFile"),validateMyRestaurantRequest,jwtCheck,jwtParse,MyRestaurantController.createMyRestaurant)
router.get('/',jwtCheck,jwtParse,MyRestaurantController.getMyRestaurant);
router.get("/order",jwtCheck,jwtParse,MyRestaurantController.getMyRestaurantOrders)

router.put('/',upload.single("imageFile"),validateMyRestaurantRequest,jwtCheck,jwtParse,MyRestaurantController.updateMyRestaurant)
router.patch("/order/:orderId/status",jwtCheck,jwtParse,MyRestaurantController.updateOrderStatus)
export default router