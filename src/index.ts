import express,{Request,Response} from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import myUserRoute from "./Routes/MyUserRoutes"
import myRestaurantRoute from "./Routes/MyRestaurantRoute";
import restaurantRoute from "./Routes/RestaurantRoute";
import orderRoute from "./Routes/OrderRoute"; 
import {v2 as cloudinary} from "cloudinary";

mongoose.connect(process.env.MONGO_URL as string).then(()=>{
    console.log('Connected to mongoDB');
});

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(cors());

app.use("/api/order/checkout/webhook",express.raw({type:"*/*"}));
app.use(express.json());


app.get("/health",async (req:Request,res:Response)=>{
    res.send({
        message:"health OK!"
    });
});

app.use("/api/my/user",myUserRoute);
app.use("/api/my/restaurant",myRestaurantRoute);

app.use("/api/restaurant",restaurantRoute);
app.listen(7000,()=>{
    console.log("server started on localhost:7000");
});

app.use("/api/order",orderRoute);
