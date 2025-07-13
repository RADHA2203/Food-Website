import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import UserRoutes from "./routes/User.js";
import FoodRoutes from "./routes/Food.js";
dotenv.config();

const app = express(); 
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));

app.use("/api/user/", UserRoutes);
app.use("/api/food", FoodRoutes);

//error handeler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    
    // Log the complete error
    console.error("=== ERROR DETAILS ===");
    console.error("Status:", status);
    console.error("Message:", message);
    console.error("Stack:", err.stack);
    console.error("=====================");
    
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

app.get("/", async (req, res) => {
    res.status(200).json({
        message: "Hello Developers",
    });
});

const connectDB = () =>{
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("Connected to MONGO DB"))
    .catch((err)=>{
        console.error("failed to connect with mongo");
        console.error(err);
    });
};

const startServer = async () => {
    try{
        connectDB();
        app.listen(8080, () => console.log("Server started on the port number 8080"))
    }catch (error){
        console.log(error);
    }
};

startServer();