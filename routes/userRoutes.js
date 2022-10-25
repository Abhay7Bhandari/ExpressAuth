import  express  from "express";
const router = express.Router();
import UserController from '../controllers/userController';
import checkUserAuth from '../middlewares/auth-middleware';


// Public Routes
router.post('/register',UserController.userRegisteration)
router.post('/login',UserController.userLogin)
router.post('/sendUserPasswordResetEmail',UserController.sendUserPasswordResetEmail)
router.post('/userPasswordReset/:id/:token',UserController.userPasswordReset)

// Protected Routes
// Route Level Middleware 
router.use('/changepassword',checkUserAuth)
.post('/changepassword',UserController.changeUserPassword)
.get('/loggeduser',UserController.loggedUser)
export default router