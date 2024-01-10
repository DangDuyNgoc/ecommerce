import { Layout } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCart } from '../context/cart';

const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cart, setCart] = useCart();

    // initial details
    useEffect(() => {
        if(params?.slug) getProduct();
    }, [params?.slug]);

    // get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getRelatedProducts(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    // get related products
    const getRelatedProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <div className='row container mt-2'>
                <div className='col-md-6'>
                <img 
                    src={`/api/v1/product/product-image/${product._id}`} 
                    className="card-img-top" 
                    alt={product.name} 
                />
                </div>
                <div className='col-md-6'>
                    <h1>Product Detail</h1>
                    <h4>Name: {product.name}</h4>
                    <h4>Description: {product.description}</h4>
                    <h4>Price: ${product.price}</h4>
                    <button className='btn btn-secondary ms -1'>Add to cart</button>
                </div>
            </div>
            <div className='row container'>
                <h6>Related Product</h6>
                {relatedProducts.length < 1 && <p>No Related Product Found</p>}
                <div className='d-flex flex-wrap'>
                    {relatedProducts?.map((product) => (
                        <div className="card m-2" style={{ width: "18rem" }} key={product._id}>
                            <img 
                                src={`/api/v1/product/product-image/${product._id}`} 
                                className="card-img-top" 
                                alt={product.name} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    {product.description}....
                                </p>
                                <p className='card-text'>{product.price}</p>
                                <button className='btn btn-secondary' onClick={() => {
                                    toast.success('Item Added to cart')
                                    }}
                                  >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails