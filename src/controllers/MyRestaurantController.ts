import { Request,Response } from "express"
import Restaurant from "../models/Restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";


const createMyRestaurant = async (req:Request,res:Response)=>{
    try {
      //check if user has a restuarant, each user can create 1 restaurant at most
        const existingRestaurant = await Restaurant.findOne({user:req.userId});
        if(existingRestaurant)
        {
            res.status(409).json({
                message:"You already have a restaurant"
            });
        }

        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;


        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);


        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();
        await restaurant.save();

        res.status(201).send(restaurant)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Something went wrong"
        })
    }
}

const getMyRestaurant = async (req:Request,res:Response)=>{
    try {
      //check if user has a restuarant, each user can create 1 restaurant at most
        const restaurant = await Restaurant.findOne({user:req.userId});
        if(!restaurant)
        {
            res.status(404).json({
                message:"Restaurant not found"
            });
        }

        res.status(201).send(restaurant)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Error fetching restaurant"
        })
    }
}


export default {
    createMyRestaurant,
    getMyRestaurant
}