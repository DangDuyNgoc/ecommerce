import React, { useEffect, useState } from 'react';
import { Checkbox, Radio } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import { Price } from './../components/Price';
import { useCart } from '../context/cart';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useCart();
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count');
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category');
      if(data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getTotal();
  }, []);

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if(page === 1) return;
    loadMore();
  }, [page]);

  // load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if(checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if(value) {
      all.push(id);
    } else {
      all = all.filter(c => c !== id);
    }
    setChecked(all);
  };

  // filter product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post('/api/v1/product/product-filters', {
        checked,
        radio
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={'All Products - Best Offers'}>
      <div className='row mt-3'>
        <div className='col-md-2'>
          <h6 className='text-center'>Filter By Category</h6>
          <div className='d-flex flex-column'>
            {categories?.map(cate => (
              <Checkbox 
                key={cate._id}
                onChange={(e) => handleFilter(e.target.checked, cate._id)}
              >
                {cate.name}
              </Checkbox>
            ))}
          </div>

          <h6 className='text-center'>Filter By Price</h6>
          <div className='d-flex flex-column'>
          <Radio.Group onChange={(e) => setRadio(e.target.value)}>
            {Price.map(p => (
              <div key={p._id}>
                <Radio value={p.array}>{p.name}</Radio>
              </div>
            ))}
          </Radio.Group>
          </div>
        </div>
        <div className='col-md-9 offset-1'>
          <h1 className='text-center'>All Products</h1>
          <div className='d-flex flex-wrap'>
            {products.map((product) => (
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
                  <button 
                    className='btn btn-primary'
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    More Details
                  </button>
                  <button className='btn btn-secondary' onClick={() => {
                    setCart([...cart, product]);
                    localStorage.setItem("cart", JSON.stringify([...cart, product]));
                    toast.success('Item Added to cart')
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className='m-2 p-3'>
            {products && products.length < total && (
              <button className='btn btn-warning'
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page +1);
                }}
              >
                {loading ? "Loading...." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage