import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

var checkUserAuth = async(req,res,next) => {
    try {
        let authHeader = req.headers.authorization;
        console.log(authHeader);
        if(!authHeader){
            res.send({error: 'error'});
        }
        const token = authHeader.split(' ')[1];
        console.log(token);
        const { userID } = jwt.verify(token,process.env.JWT_SECRET_KEY) 
        console.log(userID);
        req.user = await UserModel.findById(userID);
        console.log('ABhay',req.user);
        next();
    } catch (error) {
        res.send({error: error});
    }
}

export default checkUserAuth;