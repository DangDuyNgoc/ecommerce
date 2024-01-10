import React from 'react';
import { useAuth } from '../../context/auth';

import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';

const AdminDashboard = () => {

    const [auth] = useAuth();

  return (
    <Layout>
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-3'>
                    <div className='card w-75 p-3'>
                        <h1>{auth?.user?.name}</h1>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default AdminDashboard