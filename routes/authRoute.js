import express from 'express';
import { 
    forgotPasswordController,
    loginController,
    ordersAdminController,
    ordersController,
    registerController,
    updateOrderStatus,
    updateProfileController,
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router();

// routing
// Register || Method Post
router.post('/register', registerController);

// Login || POST
router.post('/login', loginController);

// Forgot Password || POST
router.post('/forgot-password', forgotPasswordController);

// protected Client route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ success: true })
}); 

// protected aAdmin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ success: true })
});

// update-profile
router.put('/profile', requireSignIn,updateProfileController);

// orders
router.get('/orders', requireSignIn, ordersController);

// admin orders
router.get('/orders-admin', requireSignIn, isAdmin, ordersAdminController);

// update order status
router.put('/update-order/:orderId', requireSignIn, isAdmin, updateOrderStatus);

export default router;
