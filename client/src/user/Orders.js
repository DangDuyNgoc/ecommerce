import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import Layout from "../components/Layout/Layout";
import UserMenu from "../components/Layout/UserMenu";
import { useAuth } from "../context/auth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  // get orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/orders');
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Orders Page">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>All Orders</h1>
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
                        <th>{ order?.status }</th>
                        <th>{ moment(order?.createdAt).fromNow() }</th>
                        <th>{ order?.payment?.success ? "Success" : "Failed" }</th>
                        <th>{ order?.status }</th>
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
      </div>
    </Layout>
  );
};

export default Orders;
