const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const connectDB = require("mb64-connect");

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB("mongodb+srv://harirajh076:w4GAwJYtmgEsqsFM@cluster0.3wrkq.mongodb.net/contact");

// User Schema and Model
const UserModel = connectDB.validation("contact", {
    firstname: String,
    lastname: String,
    email: String,
    phonenumber: String,
    company: String,
    jobtitle: String
});

// Routes

// Get a user by ID
app.get("/getdata/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById({ _id: id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a user by ID
app.put("/updatedata/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await UserModel.findByIdAndUpdate({ _id: id }, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                company: req.body.company,
                jobtitle: req.body.jobtitle
            }, { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a user by ID
app.delete('/deletedata/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await UserModel.findByIdAndDelete({ _id: id });
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all users
app.get('/', async(req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new user
app.post("/createuser", async(req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, company, jobtitle } = req.body;

        // Basic validation
        if (!firstname || !lastname || !email) {
            return res.status(400).json({ error: "Firstname, lastname, and email are required" });
        }

        const newUser = await UserModel.create({ firstname, lastname, email, phonenumber, company, jobtitle });
        res.status(201).json({ message: "User created successfully", newUser });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});