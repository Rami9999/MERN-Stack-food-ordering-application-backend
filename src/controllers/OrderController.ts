import Stripe from "stripe";
import { Request,Response } from "express";
import Restaurant, { MenuItemType } from "../models/Restaurant";
import Order from "../models/Order";
const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL;


type CheckoutSessionRequest = {
    cartItems: {
        menuItemId:string,
        name:string,
        quantity:string
    }[],
    deliveryDetails:{
        email:string,
        name:string,
        country:string,
        addressLine1:string,
        city:string,
    },
    restaurantId:string
}
const createCheckoutSession = async (req:Request,res:Response) =>{
    try {

        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
        if(!restaurant)
        {
            throw new Error("Restaurant not found");
        }

        const newOrder = new Order({
            restaurant:restaurant,
            user:req.userId,
            status:"placed",
            deliveryDetails:checkoutSessionRequest.deliveryDetails,
            cartItems:checkoutSessionRequest.cartItems,
            createdAt:new Date(),
        });

        const lineItems = createLineItems(checkoutSessionRequest,restaurant.menuItems);

        const session = await createSession(lineItems,newOrder._id.toString(),restaurant.deliveryPrice,restaurant._id.toString());

        if(!session.url)
        {
            return res.status(500).json({message:"Error creating stripe session"});
        }

        await newOrder.save();
        res.json({url:session.url});

    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.raw.message})
    }
}

const createLineItems = (checkoutSessionRequest:CheckoutSessionRequest,menuItems:MenuItemType[])=>{
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem)=>{
        const menuItem = menuItems.find((item)=>item._id.toString()===cartItem.menuItemId.toString());

        if(!menuItem){
            throw new Error(`Menu Item not found: ${cartItem.menuItemId}`);
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data : {
                currency:"USD",
                unit_amount:menuItem.price,
                product_data:{
                    name:menuItem.name
                },
            },
            quantity:parseInt(cartItem.quantity),
        };

        return line_item;
    });

    return lineItems;
}

const createSession = async (lineItems:Stripe.Checkout.SessionCreateParams.LineItem[]
    ,orderId:string
    ,deliveryPrice:number
    ,restaurantId:string) =>{
        
        const sessionData = await STRIPE.checkout.sessions.create({
            line_items: lineItems,
            shipping_options:[
                {
                    shipping_rate_data:{
                        display_name:"Delivery",
                        type:"fixed_amount",
                        fixed_amount:{
                            amount:deliveryPrice,
                            currency:"USD",
                        },
                    },
                },
            ],
            mode:"payment",
            metadata:{
                orderId,
                restaurantId,
            },
            success_url:`${FRONTEND_URL}/order-status?success=true`,
            cancel_url:`${FRONTEND_URL}/details/${restaurantId}?cancel=true`
        });

        return sessionData;
}


export default {
    createCheckoutSession
}