import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_Merchant_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});  

export const createProduct = async (req, res) => {
    try {
        const { 
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;

        const { image } = req.files;

        if(!name) {
            return res.status(400).send({ error: 'Name is required' });
        }
        if(!description) {
            return res.status(400).send({ error: 'Description is required' });
        }
        if(!price) {
            return res.status(400).send({ error: 'price is required' });
        }
        if(!category) {
            return res.status(400).send({ error: 'category is required' });
        }
        if(!quantity) {
            return res.status(400).send({ error: 'quantity is required' });
        }
        if(image && image.size > 1000000) {
            return res.status(400).send({ error: 'Image is Required and should be less then 1mb' });
        }

        const products = new productModel({ ...req.fields, slug:slugify(name) });
        if(image) {
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }

        await products.save();
        res.status(200).send({
            success: true,
            message: 'Product Created Successfully',
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Category",
            error: error
        });
    }
};

// update product
export const updateProduct = async (req, res) => {
    try {
        const { 
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = req.fields;
        const { image } = req.files;

        if(!name) {
            return res.status(400).send({ error: 'Name is required' });
        }
        if(!description) {
            return res.status(400).send({ error: 'Description is required' });
        }
        if(!price) {
            return res.status(400).send({ error: 'price is required' });
        }
        if(!category) {
            return res.status(400).send({ error: 'category is required' });
        }
        if(!quantity) {
            return res.status(400).send({ error: 'quantity is required' });
        }
        if(image && image.size > 1000000) {
            return res.status(400).send({ error: 'Image is Required and should be less then 1mb' });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {
                ...req.fields,
                slug:slugify(name)
            }, 
            { new: true }    
        );
        if(image) {
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }

        await products.save();
        res.status(200).send({
            success: true,
            message: 'Product Created Successfully',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Product",
            error: error
        });
    }
}

// get all products
export const getAllProduct = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .select('-image')
            .limit(12)
            .sort({createdAt:-1});

        res.status(200).send({
            success: true,
            countProduct: products.length,
            message: 'Products List',
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get All Product",
            error: error
        });
    } 
};

// get single product
export const getSingleProduct = async (req, res) => {
    try {   
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select('-image')
            .populate('category');

        res.status(200).send({
            success: true,
            message: "Get Single Product Successfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get Product",
            error: error
        });
    }
};

// get image 
export const getProductImage = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('image')
        if(product.image.data) {
            res.set("Content-type", product.image.contentType);
            return res.status(200).send(product.image.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Get Image Product",
            error: error
        });
    }
};

// delete Product
export const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-image');
        res.status(200).send({
            success: true,
            message: 'Deleted Product SuccessFully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Product",
            error: error
        });
    }
};

// filter product
export const productFilters = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]};
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Filter Product",
            error: error
        });
    }
};

// product count
export const productCount = async (req, res)  => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Count Product",
            error: error
        });
    }
};

// product List
export const productList = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select('-image')
            .skip((page-1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in List Product",
            error: error
        });
    }
};

// search
export const searchProduct = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        })
        .select('-image');
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Search Product",
            error: error
        });
    }
};

// related product
export const relatedProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: {$ne: pid},
        }).select("-image").limit(3).populate("category");
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Related Product",
            error: error
        });
    }
};

// category of product
export const productCategory = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug:req.params.slug });
        const products = await productModel.find({ category }).populate('category');
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Category of the Products",
            error: error
        })
    }
};

// payment gateway
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({} , function(err, response) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// payment
export const paymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map(i => {
            total += i.price;
        });

        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                }
            },
            function(error, result) {
                if(result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();

                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};