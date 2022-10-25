import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trime: true},
    email: {type: String, required: true, trime: true},
    password: {type: String, required: true, trime: true},
    tc: {type: Boolean, required: true }
})

// Model
const userModel = mongoose.model("user",userSchema)

export default userModel;