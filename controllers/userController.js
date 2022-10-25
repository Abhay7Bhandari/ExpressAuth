import UserModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig";

class UserController {
  static userRegisteration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.send({ status: "failed", message: "Email Already Exists" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          try {
            // Salt bna lia
            const salt = await bcrypt.genSalt(10);
            // Kisko hash krna h and kiske basis pe hash krna h yeh krta h hashpassowrd
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name,
              email,
              password: hashPassword,
              tc,
            });
            let a = await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            // Generate JWT Token
            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "30d" }
            );
            res.status(201).send({
              status: "success",
              message: "Registered Successfully",
              token: token,
              value: a
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          res.send({ status: "failed", message: "Password Doesn't Match" });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are required" });
      }
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            const saved_user = await UserModel.findOne({ email: email });
            // Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "30d" }
            );
            res.send({
              status: "success",
              message: "Login Success",
              token: token,
            });
          } else {
            res.send({ status: "failed", message: "Password Does Not Match" });
          }
        } else {
          res.send({ status: "failed", message: "Not Registered User" });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password === password_confirmation) {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        console.log(req.user);
        const val = await UserModel.findByIdAndUpdate(req.user._id,{
          $set: {
            password: newHashPassword,
            email: newHashPassword
          }
        });
        res.send({ status: "success", value: val });
      } else {
        res.send({ status: "Does Not Match" });
      }
    } else {
      res.send({ status: "failed" });
    }
  };

  static loggedUser = async(req,res) => {
    res.send({"user": req.user})
  };

  static sendUserPasswordResetEmail = async(req,res) => {
   const {email} = req.body;
   if(email){
    const user = await UserModel.findOne({email:email});
    if(user){
      const secret = user._id + process.env.JWT_SECRET_KEY
      const token = jwt.sign({userID: user._id},secret,{expiresIn: '15m'})
      const link = `http:127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Geek Shop",
        html: `<a href = ${link}>Click here</a>`
      })
      res.send({link});
    }
   } 
  };

  static userPasswordReset = async(req,res) => {
    const {password,password_confirmation} = req.body;
    const {id,token} = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token,new_secret)
      if(password && password_confirmation){
        const salt = await bcrypt.genSalt(10)
        const newHashPassword = await bcrypt.hash(password,salt)
        await UserModel.findByIdAndUpdate(user._id,{
          $set: {
            password: newHashPassword
          }
        });
        res.send({"message": 'Send Successfully'})
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserController;
