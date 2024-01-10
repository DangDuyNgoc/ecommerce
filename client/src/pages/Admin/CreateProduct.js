import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';

import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'

const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [image, setImage] = useState('');


    // get all cate
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Ops! Something went wrong in getting category!!");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    // handle create
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("image", image);
            productData.append("category", category);
            const { data } = await axios.post('/api/v1/product/create-product', productData);
            if(data?.success) {
                navigate('/dashboard/admin/products');
                toast.success(data?.message);
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong in create product!!');
        }
    };

    return (
        <Layout title={'Dashboard - Create Product'}>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Create Product</h1>
                        <div className='m-1 w-75'>
                            <Select 
                                bordered={false} 
                                placeholder='Select a Category'
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                onChange={(value) => {setCategory(value)}}
                            >
                                {categories.map(cate => (
                                    <Option key={cate._id} value={cate._id}>
                                        {cate.name}
                                    </Option>
                                ))}
                            </Select>
                            <div className='mb-3'>
                                <label className='btn btn-out-line-secondary'>
                                    { image ? image.name: 'Upload Image' }
                                    <input 
                                        type='file' 
                                        name='image' 
                                        accept='image/*'
                                        onChange={(e) => setImage(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {image && (
                                    <div className='text-center'>
                                        <img 
                                            src={URL.createObjectURL(image)}
                                            alt=''
                                            height={'200px'}
                                            className='img img-responsive'
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <input 
                                    type='text' 
                                    value={name}
                                    placeholder='Name'
                                    className='form-control'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <input 
                                    type='text' 
                                    value={description}
                                    placeholder='Description'
                                    className='form-control'
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className='mb-3'>
                                <input 
                                    type='number' 
                                    value={price}
                                    placeholder='Pricce'
                                    className='form-control'
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            <div className='mb-3'>
                                <input 
                                    type='number' 
                                    value={quantity}
                                    placeholder='Quantity'
                                    className='form-control'
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className='mb-3'>
                                <Select
                                    bordered={false}
                                    placeholder='Select Shipping'
                                    size='large'
                                    showSearch
                                    className='form-select mb-3'
                                    onChange={(value) => setShipping(value)}
                                >
                                    <Option value='0'>No</Option>
                                    <Option value='1'>Yes</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-primary' onClick={handleCreate}>
                                    Create Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct