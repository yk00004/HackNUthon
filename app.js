import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import session from "express-session";
import ejsMate from "ejs-mate";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { fileURLToPath } from "url";
import User from "./models/user.js";
import Inventory from "./models/inventry.js";

// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

app.use(session({
    secret: "TECKAVENGERS",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));

passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

import multer from "multer";
import {cloudinary, storage } from "./cloudConfig.js";

const upload = multer({ storage });



// for image 
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
// Flask API endpoint
const url = "http://127.0.0.1:5001/detect";

async function sendImageForDetection(imageUrl) {
    try {
        // Resolve the absolute image path
        const imagePath = path.join(__dirname, imageUrl);

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            console.error("Error: Image file not found at", imagePath);
            return;
        }

        // Create form-data object
        const formData = new FormData();
        formData.append("image", fs.createReadStream(imagePath));

        // Send POST request to Flask API
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(), // Important: Set correct headers
            },
        });

        // console.log("Detected Objects:", response.data);
    } catch (error) {
        console.error("Error:", error.message);
    }
}
// sendImageForDetection("download.jpeg");


import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: "" });


async function gemini(data) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: data }] }],
    });
    const resultText = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
    const match = resultText.match(/\*\*(.*?)\*\*/); // Extracts text inside **bold**
    const category = match ? match[1] : resultText.split(" ").pop(); // Fallback: last word
    // console.log(category);
    return category;
}

let name = "orange"

// await gemini(`give me a category of ${name} like fruit, vegetable, dairy product, meat etc... give ans only one word`);
// await gemini(`Give me average price of ${name} per kilo according to Indian market give ans only one number.`);
// await gemini(`give me a average life of ${name}  in hour  give ans only one number`);


async function main() {
    await mongoose.connect("mongodb://localhost:27017/HackNUthon", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Database Connected");
}
main();

app.get("/", (req, res) => {
    res.render("users/login.ejs");
});
app.get("/inventory", (req, res) => {
    // console.log("inventry");
    res.render("pages/inventory.ejs");
});
app.get("/menu", (req, res) => {
    // console.log("menu");
    res.render("pages/menu.ejs");
});
app.get("/prediction", (req, res) => {
    // console.log("prediction");
    res.render("pages/prediction.ejs");
});

app.post("/signup", async (req, res) => {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });

    try {
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                console.error(err);
                return res.redirect("/");
            }
            res.redirect("/");
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.redirect("/");
    }
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/inventory" }), (req, res) => {
    

    res.redirect("/inventory");
});
app.post("/inventory/adddata", async (req, res) => {
    try {
        console.log(req.body.image);
        const result =await cloudinary.uploader.upload(req.body.image, { folder: "HackNUthon" })
        
        console.log(result.url);
        let url = result.secure_url;
        // console.log(url);
        
        let detectedname=sendImageForDetection(url);
        
        const itemName = detectedname; // Extract item name from URL
        // console.log(detectedname);
        

        // Get category, price, and shelf life using Gemini
        const category = await gemini(`give me a category of ${itemName} like fruit, vegetable, dairy product, meat etc... give ans only one word`);
        const price = await gemini(`Give me average price of ${itemName} per kilo according to Indian market give ans only one number.`);
        const life = await gemini(`give me an average life of ${itemName} in hours. Give answer only as one number`);
        // Create and save inventory entry
        const newInventory = new Inventory({
            name:detectedname,
            quntity: 10,  // Default quantity (you can modify this)
            price: parseFloat(price) || 0,  // Convert price to number
            category: category || "Unknown", // Fallback in case of missing response
            shelfLife: parseInt(life) || 0, // Convert life to number
            author: new mongoose.Types.ObjectId(), // Replace with actual user ID
        });
        await newInventory.save();
        res.send(`Inventory for ${itemName} added successfully! Category: ${category}, Price: ₹${price}/kg, Shelf Life: ${life} hours.`);
    } catch (error) {
        console.error("Error adding inventory:", error);
        res.status(500).send("Error adding inventory data");
    }
});


app.listen(3000, () => {
    console.log("Server running on port 3000...");
});
