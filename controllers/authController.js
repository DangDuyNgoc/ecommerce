import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT  from "jsonwebtoken";

export const registerController = async(req, res) => {
    try{
        const { name, email, password, phone } = req.body;

        if(!name) {
            return res.send({message: "Name is required"});
        }

        if(!email) {
            return res.send({message: "Email is required"});
        }

        if(!password) {
            return res.send({message: "Password is required"});
        }

        if(!phone) {
            return res.send({message: "Phone is required"});
        }

        // existing user
        const existing = await userModel.findOne({email})
        if(existing) {
            return res.status(200).send({
                success: false,
                message: "User already exists"
            });
        };

        // register user
        const hashedPassword = await hashPassword(password);

        // save
        const user = await new userModel({name, email, phone, password: hashedPassword}).save();

        res.status(201).send({
            success: true,
            message: "Register Successfully",
            user
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
};

// POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if(!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email or password'
            })
        };

        // check user
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "Haven't registered an account yet"
            })
        };

        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        };

        // token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            token,
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong!',
            error
        })
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;

        if(!email) {
            res.status(400).send({ message: "Email is required" });
        }

        if(!password) {
            res.status(400).send({ message: "Password is required" });
        }

        if(!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }

        const user = await userModel.findOne({ email, password });
        if(!user) {
            return res.send(404).send({
                success: false,
                message: "Wrong Email Or Password"
            })
        };

        // check match password
        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.status(401).send({
                status: false,
                message:"Wrong password!"
            });
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Reset Password Successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong!',
            error
        })
    }
}

// update profile
export const updateProfileController = async (req, res) => {
    try{
        const { name, email, phone, password } = req.body;
        const user = await userModel.findById(req.user._id);

        if(password && password.length < 6) {
            return res.json({error: 'Password is required and less than 6 characters'})
        };
        
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updateUser = await userModel.findByIdAndUpdate(
            req.user._id, 
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                email: email || user.email,
                phone: phone || user.phone
            }, 
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            updateUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong in Update Profile!',
            error
        })
    }
};

// orders
export const ordersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-image")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting Orders",
            error: error
        })
    }
};

// orders Admin
export const ordersAdminController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-image")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" })
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting Orders",
            error: error
        })
    }
};

// update order status 
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true} 
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Orders Status",
            error: error
        })
    }
}