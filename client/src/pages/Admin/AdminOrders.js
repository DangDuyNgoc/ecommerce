import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Select } from "antd";

import Layout from '../../components/Layout/Layout';
import AdminMenu from './../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';
import moment from 'moment';

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancel"]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  // get orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/orders-admin');
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } =  await axios.put(
        `/api/v1/auth/update-order/${orderId}`, 
        { status: value }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Layout title={"Admin Orders"}>
        <div className='row'>
            <div className='col-md-3'>
                <AdminMenu />
            </div> 
            <div className='col-md-9'>
              <h1 className="text-center">All Orders</h1>
              {orders?.map((order, index) => {
                return (
                  <div className="border shadow" key={index}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Status</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">date</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{ index + 1 }</th>
                          <td>
                            <Select
                              bordered={false}
                              onChange={(value) => handleChange(order._id, value)}
                              defaultValue={order?.status}
                            >
                              {status.map((s,i) => (
                                <Option 
                                  key={i} 
                                  value={s}
                                >
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </td>
                          <th>{ order?.status }</th>
                          <th>{ moment(order?.createdAt).fromNow() }</th>
                          <th>{ order?.payment?.success ? "Success" : "Failed" }</th>
                          <td>{ order?.products?.length }</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {order?.products?.map((p, index) => (
                        <div className='row cart flex-row' key={index}>
                            <div className='col-md-4'>
                                <img 
                                    className='card-img-top'
                                    width="100%"
                                    height={'130xp'}
                                    alt={p.name}
                                    src={`/api/v1/product/product-image/${p._id}`}
                                />
                            </div>
                            <div className='col-md-4'>
                                <p>{p.name}</p>
                                <p>{p.description}</p>
                                <p>Price: {p.price}</p>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
    </Layout>
  )
};

export default AdminOrders