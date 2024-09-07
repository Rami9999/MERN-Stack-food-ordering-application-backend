import express,{Request,Response} from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import myUserRoute from "./Routes/MyUserRoutes"

mongoose.connect(process.env.MONGO_URL as string).then(()=>{
    console.log('Connected to mongoDB');
});

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/my/user",myUserRoute);

app.listen(7000,()=>{
    console.log("server started on localhost:7000");
});
